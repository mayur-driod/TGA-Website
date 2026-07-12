"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "@/components/ui/8bit/styles/retro.css";

type GameStatus = "idle" | "run" | "dead";

const W = 640, H = 200, GY = 158;
const GRAVITY = 1400;
const JUMP_VY = -420;
const P_W = 16, P_H = 20;
const P_X = 80;
const MAX_HP = 3;
const STORAGE_KEY = "tga-runner-best";

const PLAYER = [
  [[0,1,1,0],[1,1,1,1],[0,1,1,0],[1,0,0,1]],
  [[0,1,1,0],[1,1,1,1],[0,1,1,0],[0,1,1,0]],
];

const TREE = [
  [[0,0,1,0,0],[0,1,1,1,0],[1,1,1,1,1],[0,0,1,0,0]],
  [[0,0,1,0,0],[1,1,1,1,1],[0,1,1,1,0],[0,0,1,0,0]],
];

const px = (grid: number[][], x: number, y: number, col: string, s: number, ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = col;
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[r].length; c++)
      if (grid[r][c]) ctx.fillRect(x + c * s, y + r * s, s, s);
};

interface Props { className?: string }

export default function ForestRunnerGame({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [msg, setMsg] = useState("SPACE · ↑ · tap to start");
  const [hud, setHud] = useState({ trees: 0, water: 0, best: 0, hp: MAX_HP });

  const s = useRef({
    status: "idle" as GameStatus,
    t: 0, lastFrame: 0, acc: 0,
    speed: 130,
    gx: 0,
    py: GY - P_H, pvy: 0, onGround: true,
    pframe: 0, pftick: 0,
    invuln: 0,
    spawnTimer: 1.2,
    trees: 0, water: 0, best: 0, hp: MAX_HP,
    lastPlant: -999,
    obs: [] as { type: string; x: number; y: number; w: number; h: number; age?: number }[],
    parts: [] as { x: number; y: number; vx: number; vy: number; life: number; col: string }[],
    stars: [] as { x: number; y: number; b: boolean }[],
    raf: 0,
  });

  const burst = useCallback((x: number, y: number, col: string) => {
    for (let i = 0; i < 8; i++)
      s.current.parts.push({ x, y, vx: (Math.random()-0.5)*80, vy: -Math.random()*140-40, life: 0.7, col });
  }, []);

  const updHud = useCallback((p: Partial<typeof hud>) => setHud(prev => ({ ...prev, ...p })), []);

  const reset = useCallback(() => {
    const g = s.current;
    g.t = 0; g.speed = 130; g.gx = 0;
    g.py = GY - P_H; g.pvy = 0; g.onGround = true;
    g.pframe = 0; g.pftick = 0; g.invuln = 0;
    g.spawnTimer = 1.2; g.trees = 0; g.water = 0; g.hp = MAX_HP;
    g.lastPlant = -999; g.obs = []; g.parts = [];
    updHud({ trees: 0, water: 0, hp: MAX_HP, best: g.best });
  }, [updHud]);

  const die = useCallback(() => {
    const g = s.current;
    g.status = "dead";
    const total = g.trees + g.water;
    if (total > g.best) {
      g.best = total;
      try { localStorage.setItem(STORAGE_KEY, String(g.best)); } catch {}
    }
    updHud({ trees: g.trees, water: g.water, best: g.best, hp: g.hp });
    setStatus("dead");
    setMsg("The forest needs you — try again!");
  }, [updHud]);

  const start = useCallback(() => {
    s.current.status = "run";
    reset();
    setStatus("run");
    setMsg("SPACE / ↑ / tap to jump   •   in air: plant a tree 🌱");
  }, [reset]);

  const plant = useCallback(() => {
    const g = s.current;
    if (g.t - g.lastPlant < 0.4) return;
    g.lastPlant = g.t;
    g.trees += 1;
    g.obs.push({ type: "sprout", x: P_X - 8, y: GY - 12, w: 20, h: 20, age: 0 });
    burst(P_X + 4, GY - 6, "#97c459");
    updHud({ trees: g.trees });
  }, [burst, updHud]);

  const act = useCallback(() => {
    const g = s.current;
    if (g.status !== "run") { start(); return; }
    if (g.onGround) {
      g.pvy = JUMP_VY;
      g.onGround = false;
    } else {
      plant();
    }
  }, [start, plant]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        act();
      }
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, [act]);

  // stars
  useEffect(() => {
    s.current.stars = Array.from({ length: 35 }, () => ({
      x: Math.floor(Math.random() * W),
      y: Math.floor(Math.random() * (GY - 30)),
      b: Math.random() > 0.7,
    }));
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v) {
        const n = parseInt(v);
        if (n > 0) {
          s.current.best = n;
          const rafId = requestAnimationFrame(() => {
            setHud(p => ({ ...p, best: n }));
          });
          return () => cancelAnimationFrame(rafId);
        }
      }
    } catch {}
  }, []);

  // game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const game = s.current;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const sx = rect.width / W, sy = rect.height / H;
      ctx.setTransform(sx * dpr, 0, 0, sy * dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("resize", resize);

    const drawBg = () => {
      const g = s.current;
      ctx.fillStyle = "#0c1b0c";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#d9f0b0";
      for (const st of g.stars) ctx.fillRect(st.x, st.y, 1, st.b ? 2 : 1);
    };

    const drawGround = () => {
      const g = s.current;
      ctx.fillStyle = "#3b6d11";
      ctx.fillRect(0, GY + P_H - 2, W, 4);
      ctx.fillStyle = "#173517";
      ctx.fillRect(0, GY + P_H + 2, W, H);
      ctx.fillStyle = "#2b5a2b";
      for (let i = 0; i < W; i += 8) {
        const o = ((i - Math.floor(g.gx) % 8) + W) % W;
        ctx.fillRect(o, GY + P_H + 2, 4, 3);
      }
    };

    const update = (dt: number) => {
      const g = s.current;
      g.t += dt;
      // gentle ramp: starts slow, max ~220
      g.speed = Math.min(130 + g.t * 5, 220);
      g.gx += g.speed * dt;

      // physics
      g.pvy += GRAVITY * dt;
      g.py += g.pvy * dt;
      if (g.py >= GY - P_H) { g.py = GY - P_H; g.pvy = 0; g.onGround = true; }

      // walk anim
      g.pftick += dt;
      if (g.pftick > 0.18) { g.pftick = 0; g.pframe ^= 1; }

      // invuln
      if (g.invuln > 0) g.invuln = Math.max(0, g.invuln - dt);

      // spawn — generous gap, widens at start
      g.spawnTimer -= dt;
      if (g.spawnTimer <= 0) {
        // only smog (dino-cactus equivalent) + drops, no planted trees as obstacles
        if (Math.random() < 0.55) {
          // smog cloud — tight hitbox, floats just above ground
          g.obs.push({ type: "smog", x: W + 8, y: GY - 28, w: 22, h: 22 });
        } else {
          g.obs.push({ type: "drop", x: W + 6, y: GY - 35 - Math.random() * 35, w: 8, h: 12 });
        }
        // gap gets shorter as speed grows but never below 0.7s
        g.spawnTimer = Math.max(0.7, 1.3 - g.t * 0.015) + Math.random() * 0.4;
      }

      // move obs
      for (const o of g.obs) {
        o.x -= g.speed * dt;
        if (o.type === "sprout" && o.age !== undefined) o.age++;
      }
      g.obs = g.obs.filter(o => o.x > -60);

      // particles
      for (const p of g.parts) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.vy += 280 * dt; p.life -= dt;
      }
      g.parts = g.parts.filter(p => p.life > 0);

      // collisions — shrunk hitbox for fairness
      const pb = { type: "p", x: P_X + 3, y: g.py + 2, w: P_W - 6, h: P_H - 4 };
      for (const o of g.obs) {
        if (o.type === "drop") {
          if (pb.x < o.x+o.w && pb.x+pb.w > o.x && pb.y < o.y+o.h && pb.y+pb.h > o.y) {
            g.water++;
            burst(o.x, o.y, "#378add");
            o.x = -999;
            updHud({ water: g.water });
          }
        }
        if (o.type === "smog" && g.invuln <= 0) {
          // shrink smog hitbox too: +4 inset on all sides
          const sx = o.x + 5, sy = o.y + 5, sw = o.w - 10, sh = o.h - 10;
          if (pb.x < sx+sw && pb.x+pb.w > sx && pb.y < sy+sh && pb.y+pb.h > sy) {
            g.hp = Math.max(0, g.hp - 1);
            g.invuln = 1.1;
            burst(P_X + 8, g.py + 8, "#e24b4a");
            updHud({ hp: g.hp });
            if (g.hp <= 0) die();
          }
        }
      }
    };

    const render = () => {
      const g = s.current;
      drawBg(); drawGround();

      // obstacles
      for (const o of g.obs) {
        if (o.type === "smog") {
          // chunky smog block
          ctx.fillStyle = "#a34b1a";
          ctx.fillRect(o.x, o.y, 30, 12);
          ctx.fillRect(o.x + 4, o.y - 6, 22, 8);
          ctx.fillStyle = "#5a2412";
          ctx.fillRect(o.x + 6, o.y + 12, 18, 4);
        }
        if (o.type === "drop") {
          ctx.fillStyle = "#5aabf0";
          ctx.fillRect(o.x + 2, o.y - 2, 4, 4);
          ctx.fillRect(o.x, o.y + 2, 8, 10);
        }
        if (o.type === "sprout") {
          const cols = ["#c5e88a", "#97c459", "#3b6d11"];
          const age = o.age ?? 0;
          const ci = Math.min(2, Math.floor(age / 12));
          px(TREE[age % 2 === 0 ? 0 : 1], o.x - 2, o.y - 8, cols[ci], 3, ctx);
        }
      }

      // particles
      for (const p of g.parts) {
        ctx.globalAlpha = Math.max(0, p.life / 0.7);
        ctx.fillStyle = p.col;
        ctx.fillRect(p.x, p.y, 3, 3);
      }
      ctx.globalAlpha = 1;

      // player
      const tint = g.invuln > 0 && Math.floor(g.invuln * 10) % 2 === 0 ? "#f9d65c" : "#97c459";
      px(PLAYER[g.pframe], P_X, g.py, tint, 4, ctx);

      // idle / dead overlay
      if (g.status !== "run") {
        ctx.fillStyle = "rgba(12,27,12,0.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.textAlign = "center";
        if (g.status === "dead") {
          ctx.fillStyle = "#e24b4a";
          ctx.font = "bold 13px 'Press Start 2P', monospace";
          ctx.fillText("GAME OVER", W / 2, H / 2 - 20);
          ctx.fillStyle = "#97c459";
          ctx.font = "8px 'Press Start 2P', monospace";
          ctx.fillText(`Trees: ${g.trees}   Water: ${g.water}`, W / 2, H / 2 + 2);
          ctx.fillStyle = "#6fa637";
          ctx.fillText("SPACE / tap to retry", W / 2, H / 2 + 22);
        } else {
          ctx.fillStyle = "#97c459";
          ctx.font = "9px 'Press Start 2P', monospace";
          ctx.fillText("THE GREEN ALLIANCE", W / 2, H / 2 - 18);
          ctx.fillStyle = "#6fa637";
          ctx.font = "8px 'Press Start 2P', monospace";
          ctx.fillText("SPACE · ↑ · tap to start", W / 2, H / 2 + 6);
        }
      }
    };

    const loop = (ts: number) => {
      const g = game;
      if (!g.lastFrame) g.lastFrame = ts;
      const dt = Math.min(0.05, (ts - g.lastFrame) / 1000);
      g.lastFrame = ts;
      if (g.status === "run") {
        g.acc += dt;
        while (g.acc >= 1 / 60) { update(1 / 60); g.acc -= 1 / 60; }
      }
      render();
      g.raf = requestAnimationFrame(loop);
    };

    game.raf = requestAnimationFrame(loop);
    const onVis = () => { game.lastFrame = 0; };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(game.raf);
    };
  }, [burst, die, updHud]);

  return (
    <div className={cn("flex w-full flex-col items-center gap-3", className)}>
      <canvas
        ref={canvasRef}
        onPointerDown={e => { e.preventDefault(); act(); }}
        className="pixelated w-full max-w-160 cursor-pointer touch-none select-none border-2 border-border"
        style={{ aspectRatio: `${W}/${H}`, imageRendering: "pixelated", maxHeight: H }}
        aria-label="Forest runner game"
      />

      {/* HUD */}
      <div className="retro flex flex-wrap items-center justify-center gap-5 text-[8px] text-muted-foreground">
        <span>Trees <span className="text-foreground">{hud.trees}</span></span>
        <span>Water <span className="text-foreground">{hud.water}</span></span>
        <span>Best <span className="text-foreground">{hud.best}</span></span>
        <span className="flex items-center gap-1">
          HP{" "}
          {Array.from({ length: MAX_HP }).map((_, i) => (
            <span key={i} className={cn("inline-block h-2 w-4 border border-border", i < hud.hp ? "bg-primary" : "bg-muted")} />
          ))}
        </span>
      </div>

      <p className="retro min-h-3.5 text-[8px] text-muted-foreground">{msg}</p>

      {status === "run" && (
        <p className="retro text-[7px] text-muted-foreground/60">
          [SPACE / ↑ / W on ground] jump &nbsp;·&nbsp; [SPACE / ↑ / W in air] plant 🌱 &nbsp;·&nbsp; dodge smoke, collect water
        </p>
      )}
    </div>
  );
}
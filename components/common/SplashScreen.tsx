"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Leaf } from "lucide-react"
import { GLOBE_READY_EVENT, SITE_NAME, SITE_TAGLINE, SPLASH_DONE_EVENT } from "@/lib/constants"

const FALLBACK_READY_MS = 2600
const MIN_VISIBLE_MS = 2400
const EXIT_START_MS = 160
const EXIT_DONE_MS = 620
const BASE_PROGRESS_DURATION_MS = 3200
const COMPLETE_PROGRESS_DURATION_MS = 900
const HOLD_PROGRESS = 94

const LOADING_STAGES = [
  { at: 6, label: "Waking the canopy" },
  { at: 18, label: "Tracing campus trails" },
  { at: 36, label: "Calibrating sighting rings" },
  { at: 54, label: "Indexing biodiversity notes" },
  { at: 72, label: "Lighting the globe" },
  { at: 88, label: "Final touches" },
  { at: 100, label: "Ready" },
]

export default function SplashScreen() {
  const [isReady, setIsReady] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const readyTimerRef = useRef<number | null>(null)
  const startTimeRef = useRef(0)

  const statusLabel = useMemo(() => {
    const stage = [...LOADING_STAGES].reverse().find((item) => progress >= item.at)
    return stage?.label ?? "Preparing experience"
  }, [progress])

  useEffect(() => {
    startTimeRef.current = performance.now()

    const handleReady = () => {
      if (readyTimerRef.current !== null) return

      const elapsed = performance.now() - startTimeRef.current
      const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0)
      readyTimerRef.current = window.setTimeout(() => setIsReady(true), remaining)
    }

    window.addEventListener(GLOBE_READY_EVENT, handleReady)
    const fallbackTimer = window.setTimeout(handleReady, FALLBACK_READY_MS)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener(GLOBE_READY_EVENT, handleReady)
      window.clearTimeout(fallbackTimer)
      if (readyTimerRef.current !== null) {
        window.clearTimeout(readyTimerRef.current)
        readyTimerRef.current = null
      }
      document.body.style.overflow = ""
    }
  }, [])

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const from = progress
    const target = isReady ? 100 : HOLD_PROGRESS
    const duration = isReady ? COMPLETE_PROGRESS_DURATION_MS : BASE_PROGRESS_DURATION_MS

    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / duration, 1)
      const eased = elapsed < 0.5 ? 2 * elapsed * elapsed : -1 + (4 - 2 * elapsed) * elapsed
      const next = Math.round(from + (target - from) * eased)
      setProgress(next)

      if (elapsed < 1) {
        raf = window.requestAnimationFrame(tick)
      } else if (target >= 100) {
        setIsComplete(true)
      }
    }

    raf = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(raf)
    }
  }, [isReady])

  useEffect(() => {
    if (!isComplete) return

    const exitTimer = window.setTimeout(() => {
      if (typeof window !== "undefined") {
        ;(window as Window & { __tgaSplashDone?: boolean }).__tgaSplashDone = true
        window.dispatchEvent(new Event(SPLASH_DONE_EVENT))
      }
      setIsExiting(true)
    }, EXIT_START_MS)
    const hideTimer = window.setTimeout(() => setIsHidden(true), EXIT_DONE_MS)
    document.body.style.overflow = ""

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(hideTimer)
    }
  }, [isComplete])

  if (isHidden) return null

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-background/95 backdrop-blur-sm transition-all duration-500 ${
        isExiting ? "pointer-events-none opacity-0 -translate-y-2" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-busy={!isReady}
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-4">
          <div className="relative grid h-12 w-12 place-items-center rounded-full border border-primary/25 bg-primary/10 text-primary">
            <span className="absolute inset-0 rounded-full border border-primary/30 motion-safe:animate-ping" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          </div>
          <div className="text-left">
            <p className="text-lg font-semibold text-foreground">{SITE_NAME}</p>
            <p className="text-[13px] text-muted-foreground">{SITE_TAGLINE}</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-accent/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/80">
          <Leaf className="h-3.5 w-3.5 text-primary" />
          RVU biodiversity
        </div>

        <div className="w-64">
          <div className="flex items-center justify-between text-[13px] font-semibold text-muted-foreground">
            <span>{statusLabel}</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary/70 transition-all duration-150 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Loading experience
        </p>
      </div>
    </div>
  )
}

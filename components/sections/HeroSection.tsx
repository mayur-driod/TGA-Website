"use client"

import {
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type RefAttributes,
} from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  Binoculars,
  Bird,
  Camera,
  Recycle,
  type LucideIcon,
} from "lucide-react"
import type { GlobeMethods, GlobeProps } from "react-globe.gl"
import { Button } from "@/components/ui/button"
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants"

type HeroRing = {
  lat: number
  lng: number
  color: [string, string]
  maxR: number
  propagationSpeed: number
  repeatPeriod: number
}

type HeroLocation = {
  name: string
  subtitle: string
  lat: number
  lng: number
  color: string
  radius: number
}

type GeoJsonGeometry = {
  type: string
  coordinates?: unknown
}

type LandTopology = {
  objects: { land: unknown }
}

type LandPolygonDatum = {
  geometry: GeoJsonGeometry
}

type OrbitBadge = {
  xClass: string
  yClass: string
  duration: number
  delay: number
  rotate: number
  icon: LucideIcon
}

const HERO_LOCATIONS: HeroLocation[] = [
  {
    name: "RV University",
    subtitle: "Bengaluru, Karnataka",
    lat: 12.9156,
    lng: 77.5046,
    color: "#376A10",
    radius: 0.36,
  },
  {
    name: "Lalbagh Botanical Garden",
    subtitle: "Urban biodiversity",
    lat: 12.9507,
    lng: 77.5848,
    color: "#5D9A30",
    radius: 0.29,
  },
  {
    name: "Bannerghatta Reserve",
    subtitle: "Field immersion",
    lat: 12.8008,
    lng: 77.5773,
    color: "#6AAE38",
    radius: 0.31,
  },
  {
    name: "Nandi Hills",
    subtitle: "Birding trail",
    lat: 13.3702,
    lng: 77.6835,
    color: "#4F8E28",
    radius: 0.27,
  },
]

const ORBIT_BADGES: OrbitBadge[] = [
  {
    xClass: "sm:left-6 md:left-8",
    yClass: "sm:top-10 md:top-12",
    duration: 5.2,
    delay: 0,
    rotate: -12,
    icon: Bird,
  },
  {
    xClass: "sm:right-6 md:right-10",
    yClass: "sm:top-16 md:top-20",
    duration: 4.8,
    delay: 0.5,
    rotate: 14,
    icon: Camera,
  },
  {
    xClass: "sm:left-8 md:left-12",
    yClass: "sm:bottom-12 md:bottom-16",
    duration: 5.6,
    delay: 0.9,
    rotate: 8,
    icon: Recycle,
  },
  {
    xClass: "sm:right-8 md:right-12",
    yClass: "sm:bottom-16 md:bottom-20",
    duration: 5,
    delay: 0.3,
    rotate: -7,
    icon: Binoculars,
  },
]

const DynamicGlobe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => <div className="h-full w-full rounded-full bg-primary/5" />,
})

const Globe = forwardRef<GlobeMethods, GlobeProps>((props, ref) =>
  createElement(
    DynamicGlobe as unknown as ComponentType<GlobeProps & RefAttributes<GlobeMethods>>,
    { ...props, ref }
  )
)

Globe.displayName = "Globe"

function GlobeVisual({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  const globeRef = useRef<GlobeMethods | null>(null)
  const [globeSize, setGlobeSize] = useState(420)
  const [activeLocation, setActiveLocation] = useState<HeroLocation>(HERO_LOCATIONS[0])
  const [landPolygons, setLandPolygons] = useState<LandPolygonDatum[]>([])

  const oceanTextureUrl = useMemo(() => {
    if (typeof window === "undefined") return

    const oceanCanvas = document.createElement("canvas")
    oceanCanvas.width = 1536
    oceanCanvas.height = 768

    const oceanCtx = oceanCanvas.getContext("2d")
    if (!oceanCtx) return

    const ocean = oceanCtx.createLinearGradient(0, 0, 0, oceanCanvas.height)
    ocean.addColorStop(0, "#AEEBFF")
    ocean.addColorStop(0.45, "#86DDF3")
    ocean.addColorStop(1, "#52BFD8")
    oceanCtx.fillStyle = ocean
    oceanCtx.fillRect(0, 0, oceanCanvas.width, oceanCanvas.height)

    for (let i = 0; i < 80; i += 1) {
      const x = (i * 137) % oceanCanvas.width
      const y = (i * 79 + (i % 7) * 11) % oceanCanvas.height
      oceanCtx.fillStyle = "rgba(255,255,255,0.10)"
      oceanCtx.fillRect(x, y, 2, 2)
    }

    return oceanCanvas.toDataURL("image/png")
  }, [])

  const rings = useMemo<HeroRing[]>(
    () => [
      {
        lat: 12.9716,
        lng: 77.5946,
        color: ["rgba(151,196,89,0.55)", "rgba(151,196,89,0.05)"],
        maxR: 8,
        propagationSpeed: 1,
        repeatPeriod: 1500,
      },
      {
        lat: 13.03,
        lng: 77.61,
        color: ["rgba(134,198,88,0.50)", "rgba(134,198,88,0.04)"],
        maxR: 6,
        propagationSpeed: 0.8,
        repeatPeriod: 1700,
      },
      {
        lat: 12.95,
        lng: 77.56,
        color: ["rgba(120,184,76,0.5)", "rgba(120,184,76,0.04)"],
        maxR: 5,
        propagationSpeed: 0.7,
        repeatPeriod: 1900,
      },
    ],
    []
  )

  useEffect(() => {
    let mounted = true

    const loadLandPolygons = async () => {
      const [{ feature }, topologyModule] = await Promise.all([
        import("topojson-client"),
        import("world-atlas/land-110m.json"),
      ])

      const topology = (topologyModule.default ?? topologyModule) as LandTopology
      const landGeo = feature(topology as never, topology.objects.land as never) as {
        features?: Array<{ geometry?: GeoJsonGeometry }>
        geometry?: GeoJsonGeometry
      }

      let nextPolygons: LandPolygonDatum[] = []

      if (Array.isArray(landGeo.features)) {
        nextPolygons = landGeo.features
          .map((item) => item.geometry)
          .filter((geometry): geometry is GeoJsonGeometry => !!geometry && typeof geometry.type === "string")
          .map((geometry) => ({ geometry }))
      } else if (landGeo.geometry && typeof landGeo.geometry.type === "string") {
        nextPolygons = [{ geometry: landGeo.geometry }]
      }

      if (mounted) {
        setLandPolygons(nextPolygons)
      }
    }

    void loadLandPolygons()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const setSize = () => {
      if (window.innerWidth < 480) {
        setGlobeSize(300)
        return
      }

      if (window.innerWidth < 640) {
        setGlobeSize(330)
        return
      }

      if (window.innerWidth < 768) {
        setGlobeSize(360)
        return
      }

      if (window.innerWidth < 1024) {
        setGlobeSize(390)
        return
      }

      setGlobeSize(420)
    }

    setSize()
    window.addEventListener("resize", setSize)

    return () => window.removeEventListener("resize", setSize)
  }, [])

  const configureGlobe = useCallback(() => {
    const globe = globeRef.current
    if (!globe) return

    globe.pointOfView({ lat: 18, lng: 77, altitude: 1.95 }, 700)
    const controls = globe.controls()

    controls.enablePan = false
    controls.enableZoom = true
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 180
    controls.maxDistance = 320
    controls.autoRotate = !shouldReduceMotion
    controls.autoRotateSpeed = 1.8
  }, [shouldReduceMotion])

  useEffect(() => {
    configureGlobe()
  }, [globeSize, configureGlobe])

  return (
    <div className="relative mx-auto flex h-75 w-75 items-center justify-center sm:h-90 sm:w-90 md:h-97.5 md:w-97.5 lg:h-107.5 lg:w-107.5">
      <div className="pointer-events-none absolute h-[82%] w-[82%] rounded-full border border-primary/25" />
      <div className="pointer-events-none absolute h-[74%] w-[74%] rounded-full bg-primary/10 blur-2xl" />

      <div className="relative overflow-hidden rounded-full border border-primary/20 shadow-2xl">
        <Globe
          ref={globeRef}
          onGlobeReady={configureGlobe}
          width={globeSize}
          height={globeSize}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={oceanTextureUrl || undefined}
          bumpImageUrl={null}
          showAtmosphere
          atmosphereColor="#BDE5AD"
          atmosphereAltitude={0.18}
          polygonsData={landPolygons}
          polygonCapColor={() => "#8FC857"}
          polygonSideColor={() => "rgba(111,167,62,0.88)"}
          polygonStrokeColor={() => "#5F9D31"}
          polygonAltitude={0.01}
          polygonCapCurvatureResolution={3}
          polygonsTransitionDuration={0}
          pointsData={HERO_LOCATIONS}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointRadius="radius"
          pointAltitude={0}
          pointResolution={18}
          pointLabel={(point) => {
            const location = point as HeroLocation
            return `${location.name}<br/>${location.subtitle}`
          }}
          onPointHover={(point) => setActiveLocation((point as HeroLocation | null) ?? HERO_LOCATIONS[0])}
          ringsData={rings}
          ringLat="lat"
          ringLng="lng"
          ringColor="color"
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
        />
      </div>

      {ORBIT_BADGES.map((orbit, index) => {
        const OrbitIcon = orbit.icon

        return (
          <motion.div
            key={`${orbit.xClass}-${orbit.yClass}`}
            className={`pointer-events-none absolute hidden ${orbit.xClass} ${orbit.yClass} rounded-full border border-primary/20 bg-background/70 p-1.5 text-primary shadow-sm backdrop-blur-sm sm:flex`}
            style={{ rotate: orbit.rotate }}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    x: [0, index % 2 === 0 ? 12 : -12, 0],
                    y: [0, -8, 0],
                  }
            }
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: orbit.duration,
              delay: orbit.delay,
              ease: "easeInOut",
            }}
          >
            <OrbitIcon className="h-3.5 w-3.5" />
          </motion.div>
        )
      })}

      <motion.div
        className="absolute bottom-2 right-2 max-w-32.5 rounded-2xl border border-primary/20 bg-background/85 px-2 py-1.5 text-[10px] leading-tight text-foreground shadow-sm backdrop-blur-sm sm:right-6 sm:max-w-42.5 sm:px-3 sm:py-2 sm:text-[11px]"
        animate={shouldReduceMotion ? undefined : { y: [0, -4, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4.2, ease: "easeInOut", delay: 0.2 }}
      >
        <p className="font-semibold text-primary">{activeLocation.name}</p>
        <p className="text-muted-foreground">{activeLocation.subtitle}</p>
      </motion.div>

      <motion.div
        className="absolute right-2 top-10 hidden rounded-full border border-primary/25 bg-background/80 px-3 py-1 text-[11px] font-medium text-foreground sm:block"
        animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3.5, ease: "easeInOut" }}
      >
        Student-led impact
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-0 hidden rounded-full border border-primary/25 bg-background/80 px-3 py-1 text-[11px] font-medium text-foreground sm:block"
        animate={shouldReduceMotion ? undefined : { y: [0, 5, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut", delay: 0.4 }}
      >
        Campus biodiversity
      </motion.div>
    </div>
  )
}

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden px-4 py-16 md:px-8 md:py-20 lg:px-12 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, #C0DD97 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-6"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Biodiversity assessment ongoing - RVU campus
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Where <span style={{ color: "#3B6D11" }}>nature</span> meets student action
          </h1>

          <p className="max-w-xl text-base text-muted-foreground md:text-lg">
            {SITE_NAME} is a student-led community at RV University focused on birdwatching, cleanup drives, expert talks, and meaningful biodiversity work. {SITE_TAGLINE}.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full px-5">
              <Link href="/sign-up">
                Join the club <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="rounded-full px-5">
              <Link href="/events">Upcoming events</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
          className="flex min-h-75 items-center justify-center sm:min-h-85"
        >
          <GlobeVisual shouldReduceMotion={!!shouldReduceMotion} />
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Binoculars,
  Compass,
  ImageIcon,
  Leaf,
  Megaphone,
  Sparkles,
  Sprout,
  Trash2,
  Users,
} from "lucide-react"

import PageHeader from "@/components/common/PageHeader"
import SectionLabel from "@/components/common/SectionLabel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"

/**
 * ---------------------------------------------------------------------------
 * Static content — swap in real copy / photo URLs whenever they're ready.
 * Image slots below render a placeholder until `src` is provided.
 * ---------------------------------------------------------------------------
 */

const ABOUT_SECTION_LINKS = [
  {
    id: "story",
    label: "Our Story",
    chipClass: "border-forest-200 bg-forest-50/75 text-forest-800 hover:bg-forest-100/80",
  },
  {
    id: "pillars",
    label: "Mission & Pillars",
    chipClass: "border-teal-200 bg-teal-50/75 text-teal-800 hover:bg-teal-100/80",
  },
  {
    id: "milestones",
    label: "Milestones",
    chipClass: "border-primary/25 bg-primary/10 text-primary hover:bg-primary/15",
  },
  {
    id: "gallery",
    label: "Gallery",
    chipClass: "border-amber-200 bg-amber-50/75 text-amber-800 hover:bg-amber-100/80",
  },
] as const

const PILLARS = [
  {
    icon: Binoculars,
    title: "Birdwatching",
    description: "Weekly walks on campus and nearby hotspots, logged and shared on eBird.",
  },
  {
    icon: Trash2,
    title: "Clean Drives",
    description: "Hands-on cleanups around campus and local green spaces, run by students.",
  },
  {
    icon: Megaphone,
    title: "Awareness Campaigns",
    description: "Talks, posters, and social pushes that make sustainability easy to act on.",
  },
  {
    icon: Users,
    title: "Community",
    description: "A space for anyone curious about nature to learn, volunteer, and belong.",
  },
] as const

const MILESTONES = [
  {
    date: "Jan 2026",
    title: "The Green Alliance is founded",
    description: "A small group of students starts with a single weekend birdwalk.",
  },
  {
    date: "Mar 2026",
    title: "First campus clean drive",
    description: "20+ volunteers clear waste along the RV University green belt.",
  },
  {
    date: "Jun 2026",
    title: "eBird hotspot registered",
    description: "Campus sightings start feeding into a shared, public species record.",
  },
  {
    date: "Sep 2026",
    title: "Committees formalized",
    description: "Outreach, events, and content committees stood up to scale the work.",
  },
] as const

const GALLERY_ITEMS = [
  { caption: "Campus bird walk", src:"/assets/photos/garbageCollection.jpg" },
  { caption: "Clean-up drive", src: "/assets/photos/UniPic.jpg" },
  { caption: "Species spotting", src: "/assets/photos/pointing.jpeg" },
  { caption: "Our story — Green Alliance origins", src: "/assets/photos/Hands Together.jpg" },
  { caption: "Awareness stall", src: "/assets/photos/Santhe.jpeg" },
  { caption: "Community event", src: "/assets/photos/Photo GBBC 2026 RVU.jpg" },
] as const

const STATS = [
  { label: "Active members", value: "60+" },
  { label: "Species logged", value: "120+" },
  { label: "Drives conducted", value: "15" },
] as const

/** Muted placeholder for a photo slot. Drop in a real <img> once available. */
function ImagePlaceholder({
  className = "",
  label,
}: {
  className?: string
  label?: string
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/60 text-muted-foreground ${className}`}
    >
      <ImageIcon className="size-6" aria-hidden />
      {label ? <span className="text-xs">{label}</span> : null}
    </div>
  )
}

function ImageModal({
  open,
  src,
  alt,
  caption,
  onClose,
}: {
  open: boolean
  src: string | null
  alt: string
  caption?: string | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open || !src) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close image preview"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={1200}
          className="max-h-[80vh] w-full object-contain"
        />
        {caption ? (
          <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
            {caption}
          </div>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground shadow-sm"
      >
        Close
      </button>
    </div>
  )
}

export default function AboutPage() {
  const [selectedImage, setSelectedImage] = useState<(typeof GALLERY_ITEMS)[number] | null>(null)

  return (
    <main className="relative overflow-hidden pb-4">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-28 h-64 w-64 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute -right-28 top-136 h-72 w-72 rounded-full bg-teal-100/50 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-60 w-60 rounded-full bg-amber-100/55 blur-3xl" />
      </div>

      <PageHeader
        title="Rooted in community, growing for the planet"
        subtitle="Who we are, what we work on, and why we started The Green Alliance."
      />

      {/* Quick nav */}
      <section className="relative z-10 px-4 py-8 md:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="w-fit rounded-xl border border-border/70 bg-background/80 p-2 shadow-sm backdrop-blur">
            <nav className="flex flex-wrap items-center gap-2">
              {ABOUT_SECTION_LINKS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 ${item.chipClass}`}
                >
                  <Compass className="size-3" aria-hidden />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section
        id="story"
        className="relative z-10 scroll-mt-28 px-4 py-6 md:px-8 lg:px-12"
      >
        <div className="mx-auto w-full max-w-7xl rounded-3xl border border-forest-100/70 bg-linear-to-b from-forest-50/60 via-background to-background p-4 md:p-6">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1.1fr_0.9fr] md:gap-10">
            <div>
              <SectionLabel className="text-forest-700">Our Story</SectionLabel>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Started on one walk, still going one walk at a time
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                <p>
                  The Green Alliance began with a handful of students who kept ending up at
                  the same spot on campus, binoculars in hand, before their first class. What
                  started as an informal walk turned into a standing group, then a club.
                </p>
                <p>
                  Today we run birdwatching sessions, campus clean drives, and awareness
                  campaigns — all led by students, for students, with a shared belief that
                  paying attention to the environment around you is the first step to caring
                  for it.
                </p>
                <p>
                  We&apos;re small on purpose. Every walk, drive, and event is something a
                  member proposed and ran themselves.
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-forest-100/70 bg-muted/40 shadow-sm transition-all duration-300 hover:shadow-md">
              <Image
                src="/assets/photos/walking.jpeg"
                alt="Our story — Green Alliance origins"
                width={500}
                height={625}
                className="aspect-4/5 w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Pillars */}
      <section
        id="pillars"
        className="relative z-10 scroll-mt-28 px-4 py-6 md:px-8 lg:px-12"
      >
        <div className="mx-auto w-full max-w-7xl rounded-3xl border border-teal-100/70 bg-linear-to-b from-teal-50/60 via-secondary/15 to-background p-4 md:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <SectionLabel className="text-teal-700">Mission & Pillars</SectionLabel>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                What we actually spend our time on
              </h2>
            </div>
            <Badge variant="secondary" className="border border-teal-200 bg-teal-100/70 text-teal-800">
              <Sparkles className="size-3" aria-hidden />
              4 focus areas
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-xl border border-border bg-card/85 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-teal-100">
                  <pillar.icon className="size-5 text-teal-700" aria-hidden />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">{pillar.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section
        id="milestones"
        className="relative z-10 scroll-mt-28 px-4 py-6 md:px-8 lg:px-12"
      >
        <div className="mx-auto w-full max-w-7xl rounded-3xl border border-primary/15 bg-linear-to-b from-primary/6 via-secondary/20 to-background p-4 md:p-6">
          <SectionLabel className="text-primary">Milestones</SectionLabel>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            A short history so far
          </h2>

          <ol className="relative mt-8 space-y-8 border-l border-primary/20 pl-6">
            {MILESTONES.map((milestone) => (
              <li key={milestone.title} className="relative">
                <span className="absolute -left-[29px] top-1 size-2.5 rounded-full border-2 border-primary/40 bg-background" />
                <Badge
                  variant="secondary"
                  className="border border-primary/20 bg-primary/10 text-primary"
                >
                  {milestone.date}
                </Badge>
                <h3 className="mt-2 text-sm font-semibold text-foreground">{milestone.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{milestone.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Gallery */}
      <section
        id="gallery"
        className="relative z-10 scroll-mt-28 px-4 py-6 md:px-8 lg:px-12"
      >
        <div className="mx-auto w-full max-w-7xl rounded-3xl border border-amber-100/70 bg-linear-to-b from-amber-50/55 via-background to-background p-4 md:p-6">
          <div className="mb-6">
            <SectionLabel className="text-amber-700">Gallery</SectionLabel>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Moments from the field
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              A few snapshots from our walks and drives. More added as we go.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {GALLERY_ITEMS.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImage(item)}
                className="group overflow-hidden rounded-xl border border-border/60 bg-card/70 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={item.src}
                    width={1000}
                    height={1000}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                    alt={item.caption ?? "Add a photo"}
                  />
                </div>
                {item.caption ? (
                  <figcaption className="px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                    {item.caption}
                  </figcaption>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </section>

      <ImageModal
        open={Boolean(selectedImage)}
        src={selectedImage?.src ?? null}
        alt={selectedImage?.caption ?? "Gallery image preview"}
        caption={selectedImage?.caption}
        onClose={() => setSelectedImage(null)}
      />

      {/* Stats strip */}
      <section className="relative z-10 px-4 py-6 md:px-8 lg:px-12">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-3 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card/85 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA footer */}
      <section id="join" className="relative z-10 px-4 py-12 md:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center rounded-2xl border border-border bg-card/85 px-6 py-8 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md md:px-8">
          <Leaf className="size-6 text-primary" aria-hidden />
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            Want to be part of this?
          </h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            No experience needed — just curiosity. Come to a walk or drive and see what it&apos;s about.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Button asChild>
              <Link href="/contact">
                <Users className="size-4" aria-hidden />
                Join us
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/events">
                <Sprout className="size-4" aria-hidden />
                Explore events
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
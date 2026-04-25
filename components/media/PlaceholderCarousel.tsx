"use client"

import { useEffect, useState } from "react"

type PlaceholderSlide = {
  id: string
  title: string
  caption: string
}

type PlaceholderCarouselProps = {
  slides?: PlaceholderSlide[]
  intervalMs?: number
  heightClassName?: string
}

const DEFAULT_SLIDES: PlaceholderSlide[] = [
  {
    id: "portrait",
    title: "Leadership portraits",
    caption: "Keep profile images framed and clean for consistency.",
  },
  {
    id: "nature",
    title: "Natural tones",
    caption: "Use balanced lighting for a premium and trustworthy look.",
  },
  {
    id: "focus",
    title: "Focus on subject",
    caption: "Square crops work best for profile cards across all devices.",
  },
]

const BACKGROUNDS = [
  "bg-linear-to-br from-primary/25 via-secondary to-background",
  "bg-linear-to-br from-emerald-100/70 via-card to-background",
  "bg-linear-to-br from-amber-100/70 via-secondary/60 to-background",
]

export default function PlaceholderCarousel({
  slides = DEFAULT_SLIDES,
  intervalMs = 3400,
  heightClassName = "h-44",
}: PlaceholderCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, intervalMs)

    return () => {
      window.clearInterval(timer)
    }
  }, [intervalMs, slides.length])

  const activeSlide = slides[activeIndex]

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card/80">
      <div className={`${heightClassName} transition-all duration-700 ${BACKGROUNDS[activeIndex % BACKGROUNDS.length]}`}>
        <div className="flex h-full flex-col justify-end bg-linear-to-t from-black/20 via-black/5 to-transparent p-3 text-white">
          <p className="text-sm font-medium tracking-tight">{activeSlide.title}</p>
          <p className="mt-1 text-xs text-white/85">{activeSlide.caption}</p>
        </div>
      </div>

      <div className="absolute right-2 top-2 flex items-center gap-1.5 rounded-full border border-white/35 bg-black/25 px-2 py-1 backdrop-blur-xs">
        {slides.map((slide, index) => (
          <span
            key={slide.id}
            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              index === activeIndex ? "bg-white" : "bg-white/50"
            }`}
            aria-hidden
          />
        ))}
      </div>
    </div>
  )
}

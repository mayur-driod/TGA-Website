"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import type { TeamCommittee } from "@/lib/types"

type CommitteeCardProps = {
  committee: TeamCommittee
}

export default function CommitteeCard({ committee }: CommitteeCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [mobileFlipped, setMobileFlipped] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const hasBannerImage = Boolean(committee.imageUrl)

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)")
    const update = () => setIsSmallScreen(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  const isMobileFlipActive = isSmallScreen && mobileFlipped

  // ─── Mobile Card ──────────────────────────────────────────────────────────
  const MobileCard = (
    <article
      className="md:hidden cursor-pointer"
      style={{ perspective: "1000px" }}
      role="button"
      aria-pressed={isMobileFlipActive}
      aria-label={`${committee.name} committee details`}
      tabIndex={0}
      onClick={() => setMobileFlipped((prev) => !prev)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          setMobileFlipped((prev) => !prev)
        }
      }}
    >
      <div
        className="relative w-full h-[clamp(30rem,88vw,36rem)] transition-transform duration-700"
        style={{ transformStyle: "preserve-3d", transform: isMobileFlipActive ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Image strip */}
          <div className="relative aspect-5/3 overflow-hidden">
            {hasBannerImage ? (
              <Image
                src={committee.imageUrl!}
                alt={`${committee.name} activity`}
                fill
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/40">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Committee
                </span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="relative flex h-[calc(100%-13.333rem)] flex-col overflow-hidden border-t border-border bg-background p-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary">Committee</p>
            <h3 className="mt-1 font-serif text-lg font-bold leading-tight text-foreground">
              {committee.name}
            </h3>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {committee.focus}
            </p>
            <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">{committee.description}</p>
          </div>
        </div>

        <div
          className="absolute inset-0 overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-sm"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="relative flex h-full flex-col overflow-hidden p-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Committee leads
            </p>
            <div className="flex flex-wrap gap-1.5 overflow-hidden">
              {committee.leads.map((lead) => (
                <span
                  key={lead}
                  className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-medium text-foreground"
                >
                  {lead}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Tap to flip back</p>
          </div>
        </div>
      </div>
    </article>
  )

  // ─── Desktop Card ─────────────────────────────────────────────────────────
  const DesktopCard = (
    <article
      tabIndex={0}
      role="button"
      aria-pressed={flipped}
      aria-label={`${committee.name} committee details`}
      onMouseEnter={() => {
        if (!isSmallScreen) setFlipped(true)
      }}
      onMouseLeave={() => {
        if (!isSmallScreen) setFlipped(false)
      }}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          setFlipped((f) => !f)
        } else if (event.key === " ") {
          event.preventDefault()
          setFlipped((f) => !f)
        }
      }}
      className="hidden md:block cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
      style={{
        perspective: "1100px",
        height: "380px",
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ───────── FRONT ───────── */}
        <div
          className="absolute inset-0 rounded-[16px] overflow-hidden border border-border bg-card flex flex-col"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* IMAGE */}
          <div className="relative aspect-5/3 bg-muted/30">
            {hasBannerImage ? (
              <Image
                src={committee.imageUrl!}
                alt={`${committee.name} activity`}
                fill
                sizes="(min-width: 1280px) 320px, (min-width: 1024px) 300px, (min-width: 768px) 260px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/30">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Committee</span>
              </div>
            )}
          </div>

          {/* BODY */}
          <div className="p-4 flex flex-col flex-1">
            <p className="text-[9.5px] font-semibold tracking-[0.2em] uppercase text-primary mb-1">
              {committee.focus}
            </p>

            <h3 className="font-serif text-[1.15rem] font-bold text-foreground leading-tight mb-2">
              {committee.name}
            </h3>

            {/* leads */}
            <div className="flex flex-wrap gap-1 mt-auto">
              {committee.leads.slice(0, 3).map((lead) => (
                <span
                  key={lead}
                  className="border border-border bg-background px-2 py-0.5 rounded-full text-[10px] text-foreground"
                >
                  {lead}
                </span>
              ))}
            </div>

            <p className="text-[9px] text-muted-foreground mt-2 tracking-wide">
              click to learn more ↺
            </p>
          </div>
        </div>

        {/* ───────── BACK ───────── */}
        <div
          className="absolute inset-0 rounded-[16px] overflow-hidden border border-border bg-card flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="p-4 flex flex-col flex-1 relative">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary mb-1">
              What We Do
            </p>

            <h3 className="font-serif text-[1.1rem] font-bold text-foreground">
              {committee.name}
            </h3>

            <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-2">
              {committee.focus}
            </p>

            <div className="h-px bg-border mb-2" />

            <p className="text-[12.5px] leading-[1.75] text-muted-foreground flex-1 overflow-y-auto">
              {committee.description}
            </p>

            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary mt-3 mb-1">
              Leads
            </p>

            <div className="flex flex-wrap gap-1">
              {committee.leads.map((lead) => (
                <span
                  key={lead}
                  className="border border-border bg-background px-2 py-0.75 rounded-full text-[11px] text-foreground"
                >
                  {lead}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )

  return (
    <>
      {MobileCard}
      {DesktopCard}
    </>
  )
}
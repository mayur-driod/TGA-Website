"use client"

import Image from "next/image"
import { useEffect, useId, useState } from "react"
import type { TeamCommittee } from "@/lib/types"

type CommitteeCardProps = {
  committee: TeamCommittee
}

// Botanical SVG leaf decoration
function LeafDecor({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M40 115 C40 115 8 85 8 52 C8 25 22 8 40 5 C58 8 72 25 72 52 C72 85 40 115 40 115Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path
        d="M40 115 C40 115 8 85 8 52 C8 25 22 8 40 5 C58 8 72 25 72 52 C72 85 40 115 40 115Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.3"
        fill="none"
      />
      <line x1="40" y1="5" x2="40" y2="115" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.8" />
      <line x1="40" y1="30" x2="22" y2="50" stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.6" />
      <line x1="40" y1="45" x2="60" y2="62" stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.6" />
      <line x1="40" y1="60" x2="18" y2="75" stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.6" />
      <line x1="40" y1="72" x2="62" y2="85" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.6" />
    </svg>
  )
}

// Dot-grid texture SVG
function DotGrid() {
  const patternId = useId()

  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.07]"
      aria-hidden
    >
      <defs>
        <pattern id={patternId} x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  )
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
        className="relative h-full w-full transition-transform duration-700"
        style={{ transformStyle: "preserve-3d", transform: isMobileFlipActive ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-[1.25rem] border border-[#2d5a27]/20 bg-[#0f1f0d] shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Image strip */}
          <div className="relative aspect-[5/3] overflow-hidden">
            {hasBannerImage ? (
              <Image
                src={committee.imageUrl!}
                alt={`${committee.name} activity`}
                fill
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a3d16] via-[#143011] to-[#0a1a08]">
                <LeafDecor className="absolute right-4 top-2 h-24 w-16 text-[#4a9e3f] opacity-60" />
                <LeafDecor className="absolute -left-4 bottom-0 h-20 w-12 text-[#3d8533] opacity-40 rotate-45" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a08]/90 via-[#0a1a08]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <span className="inline-block rounded-full border border-[#4a9e3f]/40 bg-[#1a3d16]/70 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#7ec87a] backdrop-blur-sm">
                Committee
              </span>
              <h3 className="mt-2 font-serif text-xl font-bold leading-tight text-white">{committee.name}</h3>
            </div>
          </div>

          {/* Body */}
          <div className="relative overflow-hidden p-4">
            <DotGrid />
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7ec87a]">{committee.focus}</p>
            <p className="text-sm leading-6 text-[#a0b89d]">{committee.description}</p>
          </div>
        </div>

        <div
          className="absolute inset-0 overflow-hidden rounded-[1.25rem] border border-[#2d5a27]/20 bg-[#0c170a] shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)]"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(126,200,122,0.12)_1px,transparent_1px)] bg-[length:14px_14px] opacity-60" />
          <div className="relative h-full p-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7ec87a]">
              Committee leads
            </p>
            <div className="flex flex-wrap gap-1.5">
              {committee.leads.map((lead) => (
                <span
                  key={lead}
                  className="rounded-full border border-[#4a9e3f]/35 bg-[#1a3d16]/60 px-2.5 py-0.5 text-[11px] font-medium text-[#7ec87a]"
                >
                  {lead}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-[#5a7a56]">Tap to flip back</p>
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
      className="hidden md:block cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2d5a27]/50"
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
          className="absolute inset-0 rounded-[16px] overflow-hidden border border-black/10 bg-white flex flex-col"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* IMAGE */}
          <div className="relative aspect-[5/3] bg-[#e8f0e4]">
            {hasBannerImage ? (
              <Image
                src={committee.imageUrl!}
                alt={`${committee.name} activity`}
                fill
                sizes="(min-width: 1280px) 320px, (min-width: 1024px) 300px, (min-width: 768px) 260px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-br from-[#ddecd6] via-[#c8dfc0] to-[#b8d4ae]">
                {/* blooms */}
                <div className="absolute w-[120px] h-[120px] rounded-full bg-[radial-gradient(circle,rgba(120,180,90,0.25)_0%,transparent_70%)] top-[-20px] right-[-10px]" />
                <div className="absolute w-[90px] h-[90px] rounded-full bg-[radial-gradient(circle,rgba(80,150,60,0.2)_0%,transparent_70%)] bottom-[-15px] left-[10px]" />

                <LeafDecor className="opacity-20 text-[#3d8533] w-16 h-24" />
              </div>
            )}
          </div>

          {/* BODY */}
          <div className="p-4 flex flex-col flex-1">
            <p className="text-[9.5px] font-semibold tracking-[0.2em] uppercase text-[#5a8c4a] mb-1">
              {committee.focus}
            </p>

            <h3 className="font-serif text-[1.15rem] font-bold text-[#1a2e16] leading-tight mb-2">
              {committee.name}
            </h3>

            {/* leads */}
            <div className="flex flex-wrap gap-1 mt-auto">
              {committee.leads.slice(0, 3).map((lead) => (
                <span
                  key={lead}
                  className="border border-[#5a8c4a]/30 bg-[#5a8c4a]/10 px-2 py-[2px] rounded-full text-[10px] text-[#3d6b2e]"
                >
                  {lead}
                </span>
              ))}
            </div>

            <p className="text-[9px] text-[#9ab890] mt-2 tracking-wide">
              click to learn more ↺
            </p>
          </div>
        </div>

        {/* ───────── BACK ───────── */}
        <div
          className="absolute inset-0 rounded-[16px] overflow-hidden border border-[#4a823c]/20 bg-[#f7f9f5] flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* top strip */}
          <div className="h-[6px] bg-gradient-to-r from-[#7ec87a] via-[#4a9e3f] to-[#2d6e28]" />

          {/* dotted bg */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(90,140,74,0.1)_1px,transparent_1px)] bg-[length:16px_16px]" />

          <div className="p-4 flex flex-col flex-1 relative">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#5a8c4a] mb-1">
              What We Do
            </p>

            <h3 className="font-serif text-[1.1rem] font-bold text-[#1a2e16]">
              {committee.name}
            </h3>

            <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#8aad7e] mb-2">
              {committee.focus}
            </p>

            <div className="h-[1px] bg-[#5a8c4a]/20 mb-2" />

            <p className="text-[12.5px] leading-[1.75] text-[#4a5e44] flex-1 overflow-y-auto">
              {committee.description}
            </p>

            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#5a8c4a] mt-3 mb-1">
              Leads
            </p>

            <div className="flex flex-wrap gap-1">
              {committee.leads.map((lead) => (
                <span
                  key={lead}
                  className="border border-[#4a9e3f]/35 bg-[#4a9e3f]/10 px-2 py-[3px] rounded-full text-[11px] text-[#2d6e28]"
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
"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { Globe, Link2, Mail } from "lucide-react"
import { FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6"

import { Badge } from "@/components/ui/badge"
import useScrollAnimation from "@/hooks/useScrollAnimation"
import type { TeamMemberProfile } from "@/lib/types"

type TeamCardProps = {
  member: TeamMemberProfile
  tone?: "advisor" | "leadership" | "faculty"
  revealIndex?: number
  imageLoading?: "eager" | "lazy"
}

const toneLabels: Record<NonNullable<TeamCardProps["tone"]>, string> = {
  advisor: "Advisor",
  leadership: "Leadership",
  faculty: "Faculty",
}

const toneBadges: Record<NonNullable<TeamCardProps["tone"]>, string> = {
  advisor: "border-forest-200 bg-forest-50/80 text-forest-800",
  leadership: "border-teal-200 bg-teal-50/80 text-teal-800",
  faculty: "border-amber-200 bg-amber-50/80 text-amber-800",
}

const toneBorders: Record<NonNullable<TeamCardProps["tone"]>, string> = {
  advisor:
    "hover:border-forest-200 focus-visible:border-forest-200 data-[state=open]:border-forest-200 hover:shadow-[0_0_0_1px_rgba(151,196,89,0.4)]",
  leadership:
    "hover:border-teal-200 focus-visible:border-teal-200 data-[state=open]:border-teal-200 hover:shadow-[0_0_0_1px_rgba(159,225,203,0.45)]",
  faculty:
    "hover:border-amber-200 focus-visible:border-amber-200 data-[state=open]:border-amber-200 hover:shadow-[0_0_0_1px_rgba(250,199,117,0.4)]",
}

const toneGlow: Record<NonNullable<TeamCardProps["tone"]>, string> = {
  advisor: "from-forest-100/45",
  leadership: "from-teal-100/45",
  faculty: "from-amber-100/45",
}

const tonePanelRing: Record<NonNullable<TeamCardProps["tone"]>, string> = {
  advisor:
    "group-hover/team:ring-forest-200/80 group-focus-visible/team:ring-forest-200/80 group-data-[state=open]/team:ring-forest-200/80",
  leadership:
    "group-hover/team:ring-teal-200/80 group-focus-visible/team:ring-teal-200/80 group-data-[state=open]/team:ring-teal-200/80",
  faculty:
    "group-hover/team:ring-amber-200/80 group-focus-visible/team:ring-amber-200/80 group-data-[state=open]/team:ring-amber-200/80",
}

function withProtocol(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return ""
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("mailto:")) {
    return trimmed
  }

  return `https://${trimmed}`
}

function getSocialHref(platform: TeamMemberProfile["socials"][number]["platform"], value: string) {
  const trimmed = value.trim()

  if (platform === "email") {
    return trimmed.startsWith("mailto:") ? trimmed : `mailto:${trimmed}`
  }

  if (platform === "x") {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed
    }

    return `https://x.com/${trimmed.replace(/^@/, "")}`
  }

  if (platform === "instagram") {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed
    }

    return `https://instagram.com/${trimmed.replace(/^@/, "")}`
  }

  if (platform === "linkedin") {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed
    }

    return `https://linkedin.com/in/${trimmed.replace(/^@/, "")}`
  }

  if (platform === "website") {
    return withProtocol(trimmed)
  }

  return withProtocol(trimmed)
}

function getSocialLabel(platform: TeamMemberProfile["socials"][number]["platform"]) {
  if (platform === "linkedin") {
    return "LinkedIn"
  }

  if (platform === "x") {
    return "X"
  }

  if (platform === "instagram") {
    return "Instagram"
  }

  if (platform === "website") {
    return "Website"
  }

  if (platform === "email") {
    return "Email"
  }

  return "Other link"
}

function SocialGlyph({ platform }: { platform: TeamMemberProfile["socials"][number]["platform"] }) {
  if (platform === "linkedin") {
    return <FaLinkedinIn aria-hidden className="h-4 w-4" />
  }

  if (platform === "x") {
    return <FaXTwitter aria-hidden className="h-4 w-4" />
  }

  if (platform === "instagram") {
    return <FaInstagram aria-hidden className="h-4 w-4" />
  }

  if (platform === "email") {
    return <Mail aria-hidden className="h-4 w-4" />
  }

  if (platform === "website") {
    return <Globe aria-hidden className="h-4 w-4" />
  }

  return <Link2 aria-hidden className="h-4 w-4" />
}

export default function TeamCard({ member, tone = "leadership", revealIndex = 0, imageLoading = "lazy" }: TeamCardProps) {
  const { ref, isVisible } = useScrollAnimation(0.18)
  const [isTouchMode, setIsTouchMode] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: none), (pointer: coarse)")
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const updatePointerMode = () => setIsTouchMode(pointerQuery.matches)
    const updateMotionMode = () => setPrefersReducedMotion(motionQuery.matches)

    updatePointerMode()
    updateMotionMode()

    pointerQuery.addEventListener("change", updatePointerMode)
    motionQuery.addEventListener("change", updateMotionMode)

    return () => {
      pointerQuery.removeEventListener("change", updatePointerMode)
      motionQuery.removeEventListener("change", updateMotionMode)
    }
  }, [])

  const portraitUrl =
    member.imageUrl ??
    `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=0a1a0e,1a2e1e,0f1f13`
  const isRemotePortrait = /^https?:\/\//.test(portraitUrl)
  const visibleSocials = member.socials.slice(0, 5)

  const shouldOpen = isTouchMode && isExpanded
  const cardDelay = isVisible && !prefersReducedMotion ? `${revealIndex * 60}ms` : "0ms"

  const socialLinks = useMemo(
    () =>
      visibleSocials.map((social) => ({
        ...social,
        href: getSocialHref(social.platform, social.url),
        label: getSocialLabel(social.platform),
      })),
    [visibleSocials],
  )

  const interactionState = shouldOpen ? "open" : "closed"

  return (
    <article
      ref={ref}
      tabIndex={0}
      data-state={interactionState}
      data-tone={tone}
      onClick={() => {
        if (isTouchMode) {
          setIsExpanded((prev) => !prev)
        }
      }}
      onKeyDown={(event) => {
        if (isTouchMode && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault()
          setIsExpanded((prev) => !prev)
        }
      }}
      className={`group/team relative isolate h-full cursor-pointer overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_18px_30px_-26px_rgba(0,0,0,0.55)] outline-none transition-[transform,border-color,box-shadow,opacity] duration-500 ease-out motion-reduce:transition-none ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      } motion-reduce:translate-y-0 ${
        prefersReducedMotion
          ? ""
          : "hover:-translate-y-2 focus-visible:-translate-y-2 data-[state=open]:-translate-y-2"
      } ${toneBorders[tone]} hover:shadow-xl focus-visible:shadow-xl data-[state=open]:shadow-xl`}
      style={{ transitionDelay: cardDelay }}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-0 bg-linear-to-br ${toneGlow[tone]} via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/team:opacity-100 group-focus-visible/team:opacity-100 group-data-[state=open]/team:opacity-100`}
      />

      <div className="relative aspect-[4/4.8] overflow-hidden">
        <Image
          src={portraitUrl}
          alt={`Portrait of ${member.name}, ${member.role} at Green Alliance`}
          fill
          unoptimized={isRemotePortrait}
          loading={imageLoading}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover grayscale brightness-80 transition-[filter,transform] duration-500 ease-out motion-reduce:transition-none group-hover/team:scale-[1.06] group-focus-visible/team:scale-[1.06] group-data-[state=open]/team:scale-[1.06] group-hover/team:grayscale-0 group-hover/team:brightness-100 group-focus-visible/team:grayscale-0 group-focus-visible/team:brightness-100 group-data-[state=open]/team:grayscale-0 group-data-[state=open]/team:brightness-100"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 z-20 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5">
          <Badge variant="outline" className={`px-2.5 py-1 text-[11px] uppercase tracking-widest shadow-sm ${toneBadges[tone]}`}>
            {toneLabels[tone]}
          </Badge>
          {member.isFounder ? (
            <Badge
              variant="secondary"
              className="border border-primary/25 bg-primary text-[11px] uppercase tracking-widest text-primary-foreground shadow-sm"
            >
              Founder
            </Badge>
          ) : null}
        </div>
      </div>

      <div
        className={`relative z-20 border-t border-border/70 bg-background/92 p-3 ring-1 ring-transparent transition-[box-shadow,border-color] duration-500 ${tonePanelRing[tone]}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[1.08rem] font-semibold leading-tight text-foreground">{member.name}</h3>
            <p className="mt-1 text-[0.8rem] text-muted-foreground">{member.role}</p>
          </div>
          <span className="mt-0.5 text-[10px] uppercase tracking-widest text-primary/75">
            {isTouchMode ? (shouldOpen ? "Open" : "Tap") : "Hover"}
          </span>
        </div>

        <p className="mt-2 text-[12px] text-muted-foreground">
          {member.department}
          {member.year ? ` · ${member.year}` : ""}
        </p>

        <div className="mt-2 h-px bg-border/70" />

        <div className="overflow-hidden transition-[max-height,opacity,padding-top] duration-400 ease-out motion-reduce:transition-none max-h-0 pt-0 opacity-0 group-hover/team:max-h-66 group-hover/team:pt-2 group-hover/team:opacity-100 group-focus-visible/team:max-h-66 group-focus-visible/team:pt-2 group-focus-visible/team:opacity-100 group-data-[state=open]/team:max-h-66 group-data-[state=open]/team:pt-2 group-data-[state=open]/team:opacity-100">
          <p className="line-clamp-2 text-[13px] leading-[1.55] text-muted-foreground">{member.bio}</p>

          {member.focusAreas.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {member.focusAreas.slice(0, 3).map((focus) => (
                <Badge key={focus} variant="outline" className="rounded-full bg-background/80 text-[11px] text-muted-foreground">
                  {focus}
                </Badge>
              ))}
            </div>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {socialLinks.map((social, index) => (
              <a
                key={`${member.id}-${social.platform}-${index}`}
                href={social.href}
                target={social.platform === "email" ? undefined : "_blank"}
                rel={social.platform === "email" ? undefined : "noopener noreferrer"}
                title={social.label}
                onClick={(event) => {
                  if (isTouchMode) {
                    event.stopPropagation()
                  }
                }}
                className="relative z-30 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background/90 text-primary opacity-0 translate-y-1 transition-[color,transform,border-color,opacity] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:text-foreground focus-visible:-translate-y-1 focus-visible:border-primary/40 focus-visible:text-foreground focus-visible:outline-none group-hover/team:translate-y-0 group-hover/team:opacity-100 group-focus-visible/team:translate-y-0 group-focus-visible/team:opacity-100 group-data-[state=open]/team:translate-y-0 group-data-[state=open]/team:opacity-100"
                style={{ transitionDelay: `${index * 70}ms` }}
                aria-label={`${member.name} on ${social.label}`}
              >
                <SocialGlyph platform={social.platform} />
              </a>
            ))}

            {socialLinks.length === 0 ? <span className="text-[12px] text-muted-foreground">No links added yet</span> : null}
          </div>
        </div>
      </div>

      {isTouchMode ? (
        <p className="absolute bottom-1.5 right-3 z-20 text-[10px] font-medium text-white/90 drop-shadow-sm">
          {isExpanded ? "Tap to collapse" : "Tap to expand"}
        </p>
      ) : null}
    </article>
  )
}

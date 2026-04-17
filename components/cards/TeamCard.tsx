"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { AtSign, Globe, GraduationCap, Mail, Sparkles, Sprout } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { TeamMemberProfile } from "@/lib/types"

type TeamCardProps = {
  member: TeamMemberProfile
  tone?: "advisor" | "leadership" | "faculty"
}

const toneStyles: Record<NonNullable<TeamCardProps["tone"]>, string> = {
  advisor: "from-forest-100/70 via-background to-background",
  leadership: "from-teal-100/55 via-background to-background",
  faculty: "from-amber-100/60 via-background to-background",
}

function getSocialHref(platform: TeamMemberProfile["socials"][number]["platform"], value: string) {
  const trimmed = value.trim()

  if (platform === "email") {
    return trimmed.startsWith("mailto:") ? trimmed : `mailto:${trimmed}`
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

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed
  }

  return `https://${trimmed}`
}

function SocialGlyph({ platform }: { platform: TeamMemberProfile["socials"][number]["platform"] }) {
  if (platform === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="size-3.5 fill-current">
        <path d="M6.94 8.5a1.73 1.73 0 1 1 0-3.46 1.73 1.73 0 0 1 0 3.46ZM5.45 9.86h2.97V19H5.45V9.86Zm4.84 0h2.84v1.25h.04c.4-.75 1.37-1.55 2.82-1.55 3.02 0 3.58 1.99 3.58 4.58V19h-2.97v-4.3c0-1.02-.02-2.34-1.43-2.34-1.43 0-1.65 1.12-1.65 2.27V19h-2.97V9.86Z" />
      </svg>
    )
  }

  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="size-3.5 fill-none stroke-current" strokeWidth="1.9">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (platform === "email") {
    return <Mail className="size-3.5" aria-hidden />
  }

  if (platform === "website") {
    return <Globe className="size-3.5" aria-hidden />
  }

  return <AtSign className="size-3.5" aria-hidden />
}

export default function TeamCard({ member, tone = "leadership" }: TeamCardProps) {
  const shouldReduceMotion = useReducedMotion()
  const portraitUrl =
    member.imageUrl ??
    `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`
  const shortBio = member.bio.length > 115 ? `${member.bio.slice(0, 112)}...` : member.bio
  const keyFocusAreas = member.focusAreas.slice(0, 2)
  const visibleSocials = member.socials.slice(0, 4)

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      whileHover={shouldReduceMotion ? undefined : { y: -6 }}
      className="h-full"
    >
      <Card className="relative h-full overflow-hidden border border-border/80 bg-card/95 py-0 ring-0">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-linear-to-br ${toneStyles[tone]} opacity-70`}
        />

        <div className="relative z-10">
          <div className="relative px-5 pt-5">
            <div aria-hidden="true" className="h-16 rounded-2xl bg-primary/15" />
            <motion.div
              whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
              className="-mt-12 flex justify-center"
            >
              <div className="h-32 w-32 overflow-hidden rounded-3xl border-4 border-background/90 bg-secondary shadow-lg shadow-primary/20">
                <Image
                  src={portraitUrl}
                  alt={member.name}
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          <div className="px-5 pb-5 pt-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
              {member.isFounder ? (
                <Badge variant="secondary" className="gap-1 bg-primary/10 text-[11px] text-primary">
                  <Sparkles className="size-3" aria-hidden />
                  Founder
                </Badge>
              ) : null}
            </div>
            <p className="mt-1 text-xs font-medium text-primary">{member.role}</p>
            <p className="mt-1 text-xs text-muted-foreground">{member.department}</p>
            {member.year ? <p className="text-xs text-muted-foreground">{member.year}</p> : null}

            <p className="mt-3 text-sm leading-6 text-muted-foreground">{shortBio}</p>

            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {keyFocusAreas.map((focus) => (
                <Badge key={focus} variant="outline" className="rounded-full bg-background/85 text-[11px]">
                  {focus}
                </Badge>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5 border-t border-border/70 pt-3">
              {visibleSocials.map((social, index) => (
                <a
                  key={`${member.id}-${social.platform}-${index}`}
                  href={getSocialHref(social.platform, social.url)}
                  target={social.platform === "email" ? undefined : "_blank"}
                  rel={social.platform === "email" ? undefined : "noopener noreferrer"}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground transition-colors hover:text-primary"
                  aria-label={`${member.name} ${social.platform}`}
                >
                  <SocialGlyph platform={social.platform} />
                </a>
              ))}

              {visibleSocials.length === 0 ? (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <GraduationCap className="size-3.5 text-primary/80" aria-hidden />
                  No socials listed
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <motion.div
          aria-hidden="true"
          className="absolute -bottom-12 -right-12 rounded-full bg-primary/20 blur-2xl"
          initial={{ width: 120, height: 120, opacity: 0.2 }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  width: [120, 150, 120],
                  height: [120, 150, 120],
                  opacity: [0.2, 0.32, 0.2],
                }
          }
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <Sprout className="pointer-events-none absolute right-3 top-3 size-4 text-primary/35" aria-hidden />
      </Card>
    </motion.div>
  )
}

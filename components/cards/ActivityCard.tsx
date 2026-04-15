"use client"

import type { LucideIcon } from "lucide-react"
import { Bird, Globe2, Megaphone, Recycle, Search, Presentation } from "lucide-react"
import Link from "next/link"
import type { ActivityItem } from "@/lib/types"
import useScrollAnimation from "@/hooks/useScrollAnimation"
import { cn } from "@/lib/utils"

type ActivityCardProps = {
  activity: ActivityItem
  index: number
}

const iconByType: Record<ActivityItem["iconType"], LucideIcon> = {
  bird: Bird,
  cleanup: Recycle,
  talk: Presentation,
  biodiversity: Search,
  campaign: Megaphone,
  globe: Globe2,
}

const iconBgByColor: Record<ActivityItem["colorScheme"], string> = {
  forest: "bg-forest-50 text-forest-700",
  amber: "bg-amber-50 text-amber-700",
  teal: "bg-teal-50 text-teal-700",
}

export default function ActivityCard({ activity, index }: ActivityCardProps) {
  const { ref, isVisible } = useScrollAnimation()
  const Icon = iconByType[activity.iconType]

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ transitionDelay: `${index * 80}ms` }}
      className={cn(
        "transition-all duration-500",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      <Link
        href={activity.href}
        className="block rounded-xl border border-border bg-card p-6 transition-all hover:border-forest-100 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:ring-offset-2"
      >
        <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium">
          <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-lg", iconBgByColor[activity.colorScheme])}>
            <Icon className="h-4 w-4" />
          </span>
        </div>

        <h3 className="text-sm font-medium text-foreground">{activity.title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{activity.description}</p>
      </Link>
    </div>
  )
}

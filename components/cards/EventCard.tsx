import Link from "next/link"
import type { Event } from "@/lib/types"

type EventCardProps = {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(event.date))

  return (
    <Link
      href={`/events/${event.slug}`}
      className="block rounded-xl border border-border bg-card p-4 transition-all hover:border-forest-100 hover:shadow-sm active:scale-[0.99] sm:p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:ring-offset-2"
    >
      <p className="text-xs text-muted-foreground">{formattedDate}</p>
      <h3 className="mt-2 text-sm font-medium text-foreground">{event.title}</h3>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:line-clamp-3">
        {event.shortDescription}
      </p>
      <p className="mt-4 inline-flex rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground">
        {event.type}
      </p>
    </Link>
  )
}

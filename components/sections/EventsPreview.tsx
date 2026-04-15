import Link from "next/link"
import EventCard from "@/components/cards/EventCard"
import SectionLabel from "@/components/common/SectionLabel"
import { Button } from "@/components/ui/button"
import eventsData from "@/data/events.json"
import type { Event } from "@/lib/types"

export default function EventsPreview() {
  const events = eventsData as Event[]
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const byDateAsc = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const upcoming = byDateAsc.filter((event) => new Date(event.date).getTime() >= today.getTime())

  const fallbackRecent = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const previewEvents = (upcoming.length > 0 ? upcoming : fallbackRecent).slice(0, 3)
  const featured = previewEvents.find((event) => event.featured) ?? previewEvents[0]
  const compactEvents = previewEvents.filter((event) => event.id !== featured?.id).slice(0, 2)

  if (!featured) {
    return null
  }

  const featuredDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(featured.date))

  return (
    <section className="bg-forest-50/30 px-4 py-14 md:px-8 md:py-16 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <SectionLabel>Events</SectionLabel>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Build your impact this month
            </h2>
          </div>
          <Link href="/events" className="hidden text-sm font-medium text-primary hover:underline md:block">
            View all events {"->"}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
          <article className="rounded-xl border border-forest-100 bg-forest-50 p-5 sm:p-6 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex rounded-full bg-forest-100 px-3 py-1 text-xs font-medium text-forest-800">
                {featured.type}
              </span>
              <span className="text-xs text-muted-foreground">{featuredDate}</span>
            </div>

            <h3 className="mt-4 text-lg font-medium text-forest-900 sm:text-xl">{featured.title}</h3>
            <p className="mt-3 max-w-2xl text-xs text-forest-800/90 sm:text-sm">{featured.shortDescription}</p>

            <p className="mt-4 text-xs text-forest-800/80">
              {featured.time} · {featured.location} · {featured.spotsLeft} spots left
            </p>

            <div className="mt-5 flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <Button asChild>
                <a href={featured.registrationUrl} target="_blank" rel="noopener noreferrer">
                  Register now
                </a>
              </Button>
              {featured.spotsLeft < 10 ? (
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                  Only {featured.spotsLeft} spots left
                </span>
              ) : null}
            </div>
          </article>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-1">
            {compactEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        <div className="mt-6 md:hidden">
          <Link href="/events" className="text-sm font-medium text-primary hover:underline">
            View all events {"->"}
          </Link>
        </div>
      </div>
    </section>
  )
}

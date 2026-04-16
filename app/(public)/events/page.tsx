import EventCard from "@/components/cards/EventCard"
import PageHeader from "@/components/common/PageHeader"
import eventsData from "@/data/events.json"
import type { Event } from "@/lib/types"

function splitEvents(events: Event[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = events
    .filter((event) => new Date(event.date).getTime() >= today.getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const past = events
    .filter((event) => new Date(event.date).getTime() < today.getTime())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return { upcoming, past }
}

export default function EventsPage() {
  const events = eventsData as Event[]
  const { upcoming, past } = splitEvents(events)

  return (
    <>
      <PageHeader
        title="Events"
        subtitle="Discover upcoming activities and revisit events we have already conducted."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 lg:px-12">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upcoming events</h2>
          <p className="mt-1 text-sm text-muted-foreground">Publicly viewable for everyone. Sign in only when you want to register.</p>
          {upcoming.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              No upcoming events right now.
            </p>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Past events</h2>
          <p className="mt-1 text-sm text-muted-foreground">A timeline of recent birdwalks, talks, cleanups, and workshops.</p>
          {past.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              Past events will appear here as we archive completed activities.
            </p>
          )}
        </div>
      </section>
    </>
  )
}

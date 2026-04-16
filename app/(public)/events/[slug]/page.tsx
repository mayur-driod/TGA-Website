import Link from "next/link"
import { notFound } from "next/navigation"

import { RegisterButton } from "@/components/events/RegisterButton"
import eventsData from "@/data/events.json"
import type { Event } from "@/lib/types"

type PageProps = {
  params: Promise<{ slug: string }>
}

function getEventBySlug(slug: string) {
  const events = eventsData as Event[]
  return events.find((event) => event.slug === slug)
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params
  const event = getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  const date = new Date(event.date)
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)

  const requiresRvuEmail = event.requiresRvuEmail ?? true

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8 lg:px-12">
      <Link href="/events" className="text-sm font-medium text-primary hover:underline">
        Back to events
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <article>
          <div className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {event.type}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{event.title}</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">{event.fullDescription}</p>

          {event.tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </article>

        <aside className="h-fit rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold text-foreground">Event details</h2>

          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Date</dt>
              <dd className="font-medium text-foreground">{formattedDate}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Time</dt>
              <dd className="font-medium text-foreground">{event.time}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Location</dt>
              <dd className="font-medium text-foreground">{event.location}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Spots left</dt>
              <dd className="font-medium text-foreground">{event.spotsLeft}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Registration policy</dt>
              <dd className="font-medium text-foreground">
                {requiresRvuEmail ? "RVU email required" : "Open to all signed-in users"}
              </dd>
            </div>
          </dl>

          <div className="mt-5">
            <RegisterButton
              eventId={event.id}
              eventSlug={event.slug}
              requiresRvuEmail={requiresRvuEmail}
              spotsLeft={event.spotsLeft}
              externalFormUrl={event.externalFormUrl ?? event.registrationUrl ?? null}
            />
          </div>
        </aside>
      </div>
    </section>
  )
}

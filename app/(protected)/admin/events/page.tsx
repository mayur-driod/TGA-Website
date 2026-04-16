import Link from "next/link"

import { db } from "@/lib/db"

export default async function AdminEventsPage() {
  const events = await db.event.findMany({
    orderBy: { date: "desc" },
    select: {
      id: true,
      title: true,
      date: true,
      isPublished: true,
      requiresRvuEmail: true,
      spotsTotal: true,
    },
  })

  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Events</h1>
          <p className="mt-2 text-sm text-muted-foreground">Use the RVU toggle to control who can register for each event.</p>
        </div>
        <Link href="/admin/events/new" className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          New event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="mt-6 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">No events created yet.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Access</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Spots</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">{event.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(event.date)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {event.requiresRvuEmail ? "RVU only" : "Open sign-in"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{event.isPublished ? "Published" : "Draft"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{event.spotsTotal ?? "Unlimited"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

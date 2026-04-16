import Link from "next/link"

import { db } from "@/lib/db"

export default async function AdminOverviewPage() {
  let totals = {
    users: 0,
    events: 0,
    registrations: 0,
  }

  try {
    const [users, events, registrations] = await Promise.all([
      db.user.count(),
      db.event.count(),
      db.eventRegistration.count(),
    ])

    totals = { users, events, registrations }
  } catch {
    totals = { users: 0, events: 0, registrations: 0 }
  }

  return (
    <section className="mx-auto w-full max-w-5xl">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Admin overview</h1>
      <p className="mt-2 text-sm text-muted-foreground">Manage events, registrations, and user roles from this dashboard.</p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Users</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{totals.users}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Events</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{totals.events}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Registrations</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{totals.registrations}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/admin/events" className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-muted">
          Manage events
        </Link>
        <Link href="/admin/events/new" className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-muted">
          Create event
        </Link>
        <Link href="/admin/users" className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-muted">
          Manage users
        </Link>
      </div>
    </section>
  )
}

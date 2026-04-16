import Link from "next/link"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/dashboard")
  }

  let registrations: Array<{
    id: string
    status: string
    event: { id: string; slug: string; title: string; date: Date }
  }> = []

  try {
    registrations = await db.eventRegistration.findMany({
      where: { userId: session.user.id },
      include: {
        event: {
          select: {
            id: true,
            slug: true,
            title: true,
            date: true,
          },
        },
      },
      orderBy: {
        event: {
          date: "asc",
        },
      },
    })
  } catch {
    registrations = []
  }

  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Welcome back, {session.user.name ?? "member"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Role: {session.user.role}</p>
        </div>
        <Link href="/events" className="text-sm font-medium text-primary hover:underline">
          Browse events
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">My registrations</h2>
        {registrations.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No registrations yet. Explore upcoming events and register from each event page.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {registrations.map((item) => (
              <li key={item.id} className="rounded-lg border border-border px-4 py-3">
                <p className="font-medium text-foreground">{item.event.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(item.event.date)} · {item.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

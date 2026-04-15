import Link from "next/link"

export default function EventsPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Events</h1>
      <p className="text-muted-foreground">
        Upcoming drives, workshops, and community events by The Green Alliance will be listed here.
      </p>
      <Link href="/" className="text-sm font-medium text-primary hover:underline">
        Back to home
      </Link>
    </main>
  )
}

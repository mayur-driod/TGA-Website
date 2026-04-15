import Link from "next/link"

export default function EventDetailPage() {
  return (
    <section className="mx-auto flex min-h-[65vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 py-12 text-center md:px-8 lg:px-12">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Event details</h1>
      <p className="text-muted-foreground">Single event content will be rendered here in a later section.</p>
      <Link href="/events" className="text-sm font-medium text-primary hover:underline">
        Back to events
      </Link>
    </section>
  )
}

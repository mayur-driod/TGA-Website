import { EventCreateForm } from "@/components/admin/EventCreateForm"

export default function AdminNewEventPage() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Create event</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Configure the event and choose whether registration should be RVU-only or open to all signed-in users.
      </p>

      <div className="mt-6">
        <EventCreateForm />
      </div>
    </section>
  )
}

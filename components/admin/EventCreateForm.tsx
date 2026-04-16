"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

type Payload = {
  title: string
  slug: string
  description: string
  longDescription: string
  date: string
  timeLabel: string
  location: string
  spotsTotal: string
  externalFormUrl: string
  tags: string
  requiresRvuEmail: boolean
  isPublished: boolean
  isFeatured: boolean
}

const initialState: Payload = {
  title: "",
  slug: "",
  description: "",
  longDescription: "",
  date: "",
  timeLabel: "",
  location: "",
  spotsTotal: "",
  externalFormUrl: "",
  tags: "",
  requiresRvuEmail: true,
  isPublished: false,
  isFeatured: false,
}

export function EventCreateForm() {
  const router = useRouter()
  const [form, setForm] = useState<Payload>(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setField = <K extends keyof Payload>(key: K, value: Payload[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const response = await fetch("/api/admin/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })

    const result = (await response.json()) as { error?: string }

    if (!response.ok) {
      setError(result.error ?? "Unable to create event.")
      setLoading(false)
      return
    }

    router.push("/admin/events")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-foreground">
            Title
          </label>
          <input
            id="title"
            value={form.title}
            onChange={(event) => {
              const title = event.target.value
              setField("title", title)
              setField(
                "slug",
                title
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9\s-]/g, "")
                  .replace(/\s+/g, "-")
              )
            }}
            required
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>

        <div>
          <label htmlFor="slug" className="mb-1 block text-sm font-medium text-foreground">
            Slug
          </label>
          <input
            id="slug"
            value={form.slug}
            onChange={(event) => setField("slug", event.target.value)}
            required
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(event) => setField("description", event.target.value)}
            required
            rows={2}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="longDescription" className="mb-1 block text-sm font-medium text-foreground">
            Long description
          </label>
          <textarea
            id="longDescription"
            value={form.longDescription}
            onChange={(event) => setField("longDescription", event.target.value)}
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="date" className="mb-1 block text-sm font-medium text-foreground">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={form.date}
            onChange={(event) => setField("date", event.target.value)}
            required
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>

        <div>
          <label htmlFor="timeLabel" className="mb-1 block text-sm font-medium text-foreground">
            Time
          </label>
          <input
            id="timeLabel"
            value={form.timeLabel}
            onChange={(event) => setField("timeLabel", event.target.value)}
            placeholder="06:00 AM - 08:30 AM"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>

        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium text-foreground">
            Location
          </label>
          <input
            id="location"
            value={form.location}
            onChange={(event) => setField("location", event.target.value)}
            required
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>

        <div>
          <label htmlFor="spotsTotal" className="mb-1 block text-sm font-medium text-foreground">
            Total spots
          </label>
          <input
            id="spotsTotal"
            type="number"
            min={1}
            value={form.spotsTotal}
            onChange={(event) => setField("spotsTotal", event.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>

        <div>
          <label htmlFor="tags" className="mb-1 block text-sm font-medium text-foreground">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            value={form.tags}
            onChange={(event) => setField("tags", event.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>

        <div>
          <label htmlFor="externalFormUrl" className="mb-1 block text-sm font-medium text-foreground">
            External form URL
          </label>
          <input
            id="externalFormUrl"
            value={form.externalFormUrl}
            onChange={(event) => setField("externalFormUrl", event.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <label className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={form.requiresRvuEmail}
            onChange={(event) => setField("requiresRvuEmail", event.target.checked)}
          />
          Requires RVU email
        </label>

        <label className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm">
          <input type="checkbox" checked={form.isPublished} onChange={(event) => setField("isPublished", event.target.checked)} />
          Published
        </label>

        <label className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm">
          <input type="checkbox" checked={form.isFeatured} onChange={(event) => setField("isFeatured", event.target.checked)} />
          Featured
        </label>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create event"}
        </Button>
      </div>
    </form>
  )
}

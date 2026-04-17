"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"

import { CONTACT_EMAIL } from "@/lib/constants"
import { Button } from "@/components/ui/button"

type ContactPayload = {
  name: string
  email: string
  organization: string
  subject: string
  message: string
}

const INITIAL_FORM: ContactPayload = {
  name: "",
  email: "",
  organization: "",
  subject: "",
  message: "",
}

export default function ContactForm() {
  const { data: session, status: sessionStatus } = useSession()
  const sessionDefaults = useMemo(
    () => ({
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
    }),
    [session?.user?.name, session?.user?.email],
  )

  const [form, setForm] = useState<ContactPayload>(() => ({
    ...INITIAL_FORM,
    name: sessionDefaults.name,
    email: sessionDefaults.email,
  }))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  })

  useEffect(() => {
    if (sessionStatus !== "authenticated") {
      return
    }

    setForm((prev) => ({
      ...prev,
      name: prev.name || sessionDefaults.name,
      email: prev.email || sessionDefaults.email,
    }))
  }, [sessionDefaults.email, sessionDefaults.name, sessionStatus])

  const setField = <K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: "idle", message: "" })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = (await response.json()) as { message?: string }

      if (!response.ok) {
        setStatus({
          type: "error",
          message: data.message ?? "Unable to send your message right now. Please try again shortly.",
        })
        return
      }

      setStatus({ type: "success", message: "Message sent. We will get back to you soon." })
      setForm({
        ...INITIAL_FORM,
        name: sessionDefaults.name,
        email: sessionDefaults.email,
      })
    } catch {
      setStatus({
        type: "error",
        message: "Unable to send your message right now. Please try again shortly.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-5 md:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
            Name <span className="text-destructive">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
            required
            maxLength={100}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Your full name"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
            required
            maxLength={254}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-organization" className="text-sm font-medium text-foreground">
            Organization (optional)
          </label>
          <input
            id="contact-organization"
            type="text"
            value={form.organization}
            onChange={(event) => setField("organization", event.target.value)}
            maxLength={120}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="University, company, NGO, etc."
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-subject" className="text-sm font-medium text-foreground">
            Subject (optional)
          </label>
          <input
            id="contact-subject"
            type="text"
            value={form.subject}
            onChange={(event) => setField("subject", event.target.value)}
            maxLength={140}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Partnership, event invite, media, etc."
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
          Message <span className="text-destructive">*</span>
        </label>
        <textarea
          id="contact-message"
          value={form.message}
          onChange={(event) => setField("message", event.target.value)}
          required
          minLength={10}
          maxLength={5000}
          rows={7}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Tell us how we can help..."
        />
      </div>

      {status.type !== "idle" ? (
        <p
          className={status.type === "success" ? "text-sm text-primary" : "text-sm text-destructive"}
          role="status"
          aria-live="polite"
        >
          {status.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Prefer email directly? Reach us at <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>
        </p>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send message"}
        </Button>
      </div>
    </form>
  )
}

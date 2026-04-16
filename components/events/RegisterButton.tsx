"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { RVU_EMAIL_DOMAIN } from "@/lib/constants"

type Props = {
  eventId: string
  eventSlug: string
  requiresRvuEmail: boolean
  spotsLeft: number | null
  externalFormUrl?: string | null
  initiallyRegistered?: boolean
}

const API_ERRORS: Record<string, string> = {
  "not-signed-in": "Please sign in to continue.",
  "not-rvu-email": "This event is open only to RV University email accounts.",
  "event-full": "This event is fully booked.",
  "already-registered": "You are already registered for this event.",
  "registration-closed": "Registration is currently closed for this event.",
  default: "Something went wrong. Please try again.",
}

export function RegisterButton({
  eventId,
  eventSlug,
  requiresRvuEmail,
  spotsLeft,
  externalFormUrl,
  initiallyRegistered = false,
}: Props) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(initiallyRegistered)
  const [error, setError] = useState<string | null>(null)

  if (spotsLeft === 0) {
    return (
      <Button disabled variant="secondary" className="w-full cursor-not-allowed opacity-60">
        Fully booked
      </Button>
    )
  }

  if (registered) {
    return (
      <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
        You are registered
      </div>
    )
  }

  if (externalFormUrl && !session?.user) {
    return (
      <Button asChild className="w-full">
        <a href={externalFormUrl} target="_blank" rel="noopener noreferrer">
          Register via form
        </a>
      </Button>
    )
  }

  if (status === "unauthenticated") {
    return (
      <Button onClick={() => router.push(`/sign-in?callbackUrl=/events/${eventSlug}`)} className="w-full">
        Sign in to register
      </Button>
    )
  }

  const userEmail = session?.user?.email?.toLowerCase() ?? ""
  if (requiresRvuEmail && !userEmail.endsWith(RVU_EMAIL_DOMAIN)) {
    return (
      <p className="rounded-md border border-amber-300 bg-amber-100 px-3 py-2 text-sm text-amber-900">
        Open to RVU students only.
      </p>
    )
  }

  const handleRegister = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
      })

      const data = (await response.json()) as { success?: boolean; error?: string }

      if (!response.ok || !data.success) {
        setError(API_ERRORS[data.error ?? ""] ?? API_ERRORS.default)
        return
      }

      setRegistered(true)
      router.refresh()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleRegister} disabled={loading} className="w-full">
        {loading ? "Registering..." : "Register for this event"}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}

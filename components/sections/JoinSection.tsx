"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import SectionLabel from "@/components/common/SectionLabel"
import { Button } from "@/components/ui/button"
import { RVU_EMAIL_DOMAIN, WHATSAPP_COMMUNITY_URL } from "@/lib/constants"

export default function JoinSection() {
  const [email, setEmail] = useState("")
  const router = useRouter()

  const handleGetStarted = () => {
    const value = email.trim()
    if (!value) {
      router.push("/sign-up")
      return
    }

    router.push(`/sign-up?email=${encodeURIComponent(value)}`)
  }

  return (
    <section className="bg-forest-50/40 px-4 py-20 md:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <SectionLabel>Become a member</SectionLabel>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Be part of the change
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Join The Green Alliance to explore, document, and protect urban biodiversity with a student-first community at RVU.
        </p>

        <div className="mt-6 flex w-full flex-col items-stretch gap-2 sm:flex-row sm:gap-3">
          <label htmlFor="join-email" className="sr-only">
            RVU email
          </label>
          <input
            id="join-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={`yourname${RVU_EMAIL_DOMAIN}`}
            className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:ring-offset-2"
          />
          <Button onClick={handleGetStarted} className="h-11 px-5">
            Get started
          </Button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Only {RVU_EMAIL_DOMAIN} emails are accepted
        </p>

        <Link
          href={WHATSAPP_COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-sm font-medium text-primary hover:underline"
        >
          Or join our WhatsApp community {"->"}
        </Link>
      </div>
    </section>
  )
}

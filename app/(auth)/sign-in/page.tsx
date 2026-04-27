"use client"

import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { FormEvent, useMemo, useState } from "react"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"

const ERRORS: Record<string, string> = {
  unauthorized: "You do not have permission to access that page.",
  OAuthSignin: "There was a problem signing in. Please try again.",
  AccountNotFound: "No account found for this email. Please sign up first.",
  missing_email: "An email address is required to sign in.",
  missing_email_internal: "An email address is required to sign in.",
  missingemail: "An email address is required to sign in.",
  missingemailaddress: "An email address is required to sign in.",
  EmailSignin: "Unable to send a sign-in email. Please try again.",
  Verification: "Your sign-in link is invalid or expired.",
  default: "An error occurred. Please try again.",
}

function mapError(error?: string | null) {
  if (!error) {
    return null
  }

  const normalized = error.replace(/[^a-zA-Z]/g, "").toLowerCase()

  if (normalized.includes("missing") && normalized.includes("email")) {
    return ERRORS.missing_email
  }

  return ERRORS[error] ?? ERRORS.default
}

export default function SignInPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [localError, setLocalError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)

  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"
  const errorMessage = useMemo(() => mapError(searchParams.get("error")), [searchParams])

  const handleGoogle = async () => {
    setIsGoogleLoading(true)
    await signIn("google", { callbackUrl })
    setIsGoogleLoading(false)
  }

  const handleMagicLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsEmailLoading(true)
    setLocalError(null)

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      setLocalError(ERRORS.missing_email)
      setIsEmailLoading(false)
      return
    }

    const result = await signIn("nodemailer", {
      email: normalizedEmail,
      callbackUrl,
      redirect: false,
    })

    if (result?.error) {
      setLocalError(mapError(result.error))
      setEmailSent(null)
      setIsEmailLoading(false)
      return
    }

    setEmailSent(normalizedEmail)
    setIsEmailLoading(false)
  }

  return (
    <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
        <Image
          src="/assets/logo/TGA_Main_Logo.png"
          alt="The Green Alliance logo"
          width={36}
          height={36}
          className="object-contain"
        />
      </div>

      <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground">Sign in to TGA</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Sign in with Google or request a secure magic link by email.
      </p>

      {localError || errorMessage ? (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {localError ?? errorMessage}
        </p>
      ) : null}

      {emailSent ? (
        <p className="mt-4 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-primary">
          Magic link sent to {emailSent}. Check your inbox and spam folder.
        </p>
      ) : null}

      <div className="mt-6">
        <Button className="w-full" onClick={handleGoogle} disabled={isGoogleLoading}>
          {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
        </Button>
      </div>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleMagicLink} className="space-y-3">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          placeholder="you@example.com"
          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" variant="secondary" className="w-full" disabled={isEmailLoading}>
          {isEmailLoading ? "Sending..." : "Send magic link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Events are publicly viewable. Sign in is only needed when you want to register.
      </p>

      <div className="mt-3 text-center">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          Back to home
        </Link>
      </div>
    </section>
  )
}

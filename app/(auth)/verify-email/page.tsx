import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
      <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground">Check your inbox</h1>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        We sent a sign-in link to your email address. If you do not see it, check your spam or promotions folder.
      </p>

      <div className="mt-6 text-center">
        <Link href="/sign-in" className="text-sm font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    </section>
  )
}

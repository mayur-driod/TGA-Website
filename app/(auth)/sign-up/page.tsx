import Link from "next/link"

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Create account</h1>
      <p className="text-muted-foreground">
        Registration form will be added here. This route is wired for navbar navigation.
      </p>
      <Link href="/" className="text-sm font-medium text-primary hover:underline">
        Back to home
      </Link>
    </main>
  )
}

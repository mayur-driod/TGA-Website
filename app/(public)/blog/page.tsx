import Link from "next/link"

export default function BlogPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Blog</h1>
      <p className="text-muted-foreground">
        Stories, updates, and sustainability learnings from The Green Alliance will be published here.
      </p>
      <Link href="/" className="text-sm font-medium text-primary hover:underline">
        Back to home
      </Link>
    </main>
  )
}

import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">About</h1>
      <p className="text-muted-foreground">
        The Green Alliance (TGA) is a student-led club at RV University focused on environmental action.
      </p>
      <Link href="/" className="text-sm font-medium text-primary hover:underline">
        Back to home
      </Link>
    </main>
  )
}

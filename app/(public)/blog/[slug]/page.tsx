import Link from "next/link"

export default function BlogPostPage() {
  return (
    <section className="mx-auto flex min-h-[65vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 py-12 text-center md:px-8 lg:px-12">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Blog post</h1>
      <p className="text-muted-foreground">Single post rendering will be added in upcoming sections.</p>
      <Link href="/blog" className="text-sm font-medium text-primary hover:underline">
        Back to blog
      </Link>
    </section>
  )
}

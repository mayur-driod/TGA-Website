import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-primary/5">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-2 md:px-8 lg:grid-cols-3 lg:px-12">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">The Green Alliance</p>
          <p className="text-sm text-muted-foreground">A student initiative at RV University, Bengaluru.</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Quick links</p>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/events" className="hover:text-foreground">
              Events
            </Link>
            <Link href="/blog" className="hover:text-foreground">
              Blog
            </Link>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Connect</p>
          <p className="text-sm text-muted-foreground">tga@rvu.edu.in</p>
        </div>
      </div>
    </footer>
  )
}

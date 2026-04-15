import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-primary/5">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 md:gap-8 md:px-8 lg:grid-cols-3 lg:px-12">
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
          <Link href="mailto:club_thegreenalliance@rvu.edu.in" className="text-sm text-muted-foreground hover:text-foreground">
            club_thegreenalliance@rvu.edu.in
          </Link>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8 lg:px-12">
          <p className="text-xs font-semibold text-foreground md:text-sm">
            Made with <span className="text-red-500">❤</span> in INDIA by Mayur :)
          </p>
          <p>All rights reserved 2026 The Green Alliance RV University.</p>
        </div>
      </div>
    </footer>
  )
}

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
          <Link href="mailto:club_thegreenalliance@rvu.edu.in" className="block text-sm text-muted-foreground hover:text-foreground">
            club_thegreenalliance@rvu.edu.in
          </Link>
          <div className="mt-2 flex items-center gap-3 text-muted-foreground">
            <Link
              href="https://www.instagram.com/thegreenalliance.rvu/"
              target="_blank"
              rel="noreferrer"
              aria-label="The Green Alliance on Instagram"
              className="inline-flex rounded-md p-1.5 transition-colors hover:bg-primary/10 hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="17.5" cy="6.7" r="1.1" fill="currentColor" />
              </svg>
            </Link>
            <Link
              href="https://www.linkedin.com/company/thegreenalliancervu/?viewAsMember=true"
              target="_blank"
              rel="noreferrer"
              aria-label="The Green Alliance on LinkedIn"
              className="inline-flex rounded-md p-1.5 transition-colors hover:bg-primary/10 hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
                <line x1="8" y1="10.5" x2="8" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="8" cy="7.9" r="1.1" fill="currentColor" />
                <path d="M12 16v-3.1a2 2 0 0 1 4 0V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="12" y1="10.5" x2="12" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8 lg:px-12">
          <p className="text-xs font-semibold text-foreground md:text-sm">
            Built with <span className="text-red-500">❤</span> in INDIA
          </p>
          <p>All rights reserved 2026 The Green Alliance RV University.</p>
        </div>
      </div>
    </footer>
  )
}

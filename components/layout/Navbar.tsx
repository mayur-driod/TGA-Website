import Link from "next/link"
import { Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import MobileMenu from "@/components/layout/MobileMenu"

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Biodiversity", href: "/biodiversity" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold md:text-base">The Green Alliance</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild>
            <Link href="/sign-up">Join TGA</Link>
          </Button>
        </div>

        <div className="lg:hidden">
          <MobileMenu links={NAV_LINKS} />
        </div>
      </div>
    </header>
  )
}

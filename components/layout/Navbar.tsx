"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import MobileMenu from "@/components/layout/MobileMenu"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Biodiversity", href: "/biodiversity" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
        isScrolled ? "px-2" : "px-0"
      )}
    >
      <div
        className={cn(
          "flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/90 px-4 backdrop-blur transition-all duration-500 ease-in-out md:px-8 lg:px-12",
          isScrolled &&
            "mx-auto mt-2 h-14 max-w-5xl rounded-2xl border border-border/80 bg-background/55 px-4 shadow-lg shadow-black/5 backdrop-blur-lg md:px-6 lg:px-8"
        )}
      >
        <Link href="/" className="inline-flex h-10 items-center gap-2.5 text-foreground">
          <span className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md">
            <Image
              src="/assets/logo/TGA_Main_Logo.png"
              alt="The Green Alliance logo"
              fill
              className="object-contain p-0.5"
              sizes="32px"
            />
          </span>
          <span className="whitespace-nowrap text-sm font-semibold leading-none md:text-base">The Green Alliance</span>
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

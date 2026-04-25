"use client"

import Link from "next/link"
import { Compass, LogIn, Menu, ShieldCheck, Users } from "lucide-react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/auth/SignOutButton"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type MobileMenuProps = {
  links: { label: string; href: string }[]
}

export default function MobileMenu({ links }: MobileMenuProps) {
  const { data: session } = useSession()
  const role = session?.user?.role

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu" className="h-11 w-11 rounded-xl">
          <Menu className="h-5.5 w-5.5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm p-0">
        <SheetHeader className="border-b border-border/70 px-5 pt-6 pb-5">
          <SheetTitle className="text-lg font-semibold">The Green Alliance</SheetTitle>
          <SheetDescription className="mt-1">Explore pages and opportunities to join TGA.</SheetDescription>
        </SheetHeader>

        <div className="max-h-[calc(100dvh-86px)] overflow-y-auto px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
            <div className="rounded-2xl border border-border/70 bg-card/70 p-2 shadow-sm backdrop-blur-sm">
              <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Explore</p>
              <div className="flex flex-col gap-1">
                {links.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="flex min-h-12 items-center justify-between rounded-xl px-3.5 py-2.5 text-[15px] font-medium text-foreground transition-colors hover:bg-accent active:scale-[0.99]"
                    >
                      {link.label}
                      <Compass className="h-4 w-4 text-muted-foreground" aria-hidden />
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </div>

            {session?.user ? (
              <div className="rounded-2xl border border-border/70 bg-card/70 p-3 shadow-sm backdrop-blur-sm">
                <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Account</p>
                <div className="flex flex-col gap-2">
                  <SheetClose asChild>
                    <Link
                      href="/dashboard"
                      className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                    >
                      <Users className="h-4 w-4" aria-hidden />
                      Dashboard
                    </Link>
                  </SheetClose>

                  {(role === "ADMIN" || role === "MAINTAINER") && (
                    <SheetClose asChild>
                      <Link
                        href="/admin"
                        className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-95"
                      >
                        <ShieldCheck className="h-4 w-4" aria-hidden />
                        Admin Panel
                      </Link>
                    </SheetClose>
                  )}

                  <SignOutButton className="h-12 justify-center rounded-xl" />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-border/70 bg-card/70 p-3 shadow-sm backdrop-blur-sm">
                <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Get Started</p>
                <div className="flex flex-col gap-2">
                  <SheetClose asChild>
                    <Link
                      href="/sign-in"
                      className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                    >
                      <LogIn className="h-4 w-4" aria-hidden />
                      Sign in
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link
                      href="/sign-in"
                      className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-95"
                    >
                      Join TGA
                    </Link>
                  </SheetClose>
                </div>
              </div>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

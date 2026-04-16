"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/auth/SignOutButton"
import {
  Sheet,
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
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm">
        <SheetHeader>
          <SheetTitle>The Green Alliance</SheetTitle>
          <SheetDescription>Explore pages and opportunities to join TGA.</SheetDescription>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-1 text-base text-foreground transition-colors hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}

          {session?.user ? (
            <>
              <div className="mt-4 h-px bg-border" />
              <Button asChild variant="outline">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              {(role === "ADMIN" || role === "MAINTAINER") && (
                <Button asChild>
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              <SignOutButton className="justify-start" />
            </>
          ) : (
            <>
              <div className="mt-4 h-px bg-border" />
              <Button asChild variant="outline">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-in">Join TGA</Link>
              </Button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[86vw] max-w-sm">
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
          <Button asChild className="mt-4">
            <Link href="/sign-up">Join TGA</Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

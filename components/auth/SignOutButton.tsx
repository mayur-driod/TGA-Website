"use client"

import { signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"

type Props = {
  className?: string
}

export function SignOutButton({ className }: Props) {
  return (
    <Button className={className} variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
      Sign out
    </Button>
  )
}

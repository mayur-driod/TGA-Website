import type { ReactNode } from "react"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect("/sign-in")
  }

  return <main className="min-h-[70vh] px-4 py-10 md:px-8 lg:px-12">{children}</main>
}

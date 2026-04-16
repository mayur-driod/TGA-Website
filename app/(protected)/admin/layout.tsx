import type { ReactNode } from "react"
import { redirect } from "next/navigation"

import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { auth } from "@/lib/auth"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect("/sign-in")
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "MAINTAINER") {
    redirect("/sign-in?error=unauthorized")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar role={session.user.role} />
      <main className="flex-1 bg-secondary/20 p-6 md:p-8">{children}</main>
    </div>
  )
}

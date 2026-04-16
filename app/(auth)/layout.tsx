import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-10 md:px-8">{children}</main>
  )
}

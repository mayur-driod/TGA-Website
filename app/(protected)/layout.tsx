import type { ReactNode } from "react"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <main className="min-h-[70vh] px-4 py-10 md:px-8 lg:px-12">{children}</main>
}

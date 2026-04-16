import Link from "next/link"
import type { Role } from "@prisma/client"

import { Permissions } from "@/lib/permissions"

type NavItem = {
  label: string
  href: string
  requiresAdmin?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/admin" },
  { label: "Events", href: "/admin/events" },
  { label: "Create event", href: "/admin/events/new" },
  { label: "Users", href: "/admin/users", requiresAdmin: true },
]

export function AdminSidebar({ role }: { role: Role }) {
  const items = NAV_ITEMS.filter((item) => !item.requiresAdmin || Permissions.canManageUsers(role))

  return (
    <aside className="w-64 border-r border-border bg-card p-4">
      <Link href="/" className="block rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted">
        The Green Alliance
      </Link>
      <p className="mt-2 px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{role}</p>
      <nav className="mt-4 flex flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

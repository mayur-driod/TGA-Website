import { auth } from "@/lib/auth"
import { UserDetailsEditor } from "@/components/admin/UserDetailsEditor"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function AdminUsersPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/sign-in")
  }

  if (session.user.role !== "ADMIN") {
    redirect("/sign-in?error=unauthorized")
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          registrations: true,
        },
      },
    },
  })

  return (
    <section className="mx-auto w-full max-w-6xl">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Users</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Update user name, email, and role. You cannot change your own role.
      </p>

      <div className="mt-6 overflow-x-auto">
        <UserDetailsEditor
          users={users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            registrationsCount: user._count.registrations,
          }))}
          currentUserId={session.user.id}
          canManageRoles
        />
      </div>
    </section>
  )
}

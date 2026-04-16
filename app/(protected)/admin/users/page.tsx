import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { RoleSelect } from "@/components/admin/RoleSelect"

export default async function AdminUsersPage() {
  const session = await auth()

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
      <p className="mt-2 text-sm text-muted-foreground">Role management is available only for admins. You cannot change your own role.</p>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Registrations</th>
              <th className="px-4 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-border align-top">
                <td className="px-4 py-3 font-medium text-foreground">{user.name ?? "-"}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(user.createdAt)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user._count.registrations}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  <RoleSelect userId={user.id} currentRole={user.role} disabled={session?.user?.id === user.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

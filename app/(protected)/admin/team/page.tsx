import { redirect } from "next/navigation"

import { TeamDataEditor } from "@/components/admin/TeamDataEditor"
import { auth } from "@/lib/auth"
import { Permissions } from "@/lib/permissions"
import { getTeamHierarchyData } from "@/lib/team-content"

export default async function AdminTeamPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/sign-in")
  }

  if (!Permissions.canManageTeam(session.user.role)) {
    redirect("/sign-in?error=unauthorized")
  }

  const teamData = await getTeamHierarchyData()

  return (
    <section className="mx-auto w-full max-w-6xl">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Team content</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Manage the public Team page content from here instead of editing files manually.
      </p>

      <div className="mt-6">
        <TeamDataEditor initialData={teamData} />
      </div>
    </section>
  )
}

import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { Permissions } from "@/lib/permissions"
import { isTeamHierarchyData, saveTeamHierarchyData, getTeamHierarchyData } from "@/lib/team-content"

export async function GET() {
  const session = await auth()

  if (!session?.user || !Permissions.canManageTeam(session.user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  const data = await getTeamHierarchyData()
  return NextResponse.json({ data })
}

export async function PATCH(req: Request) {
  const session = await auth()

  if (!session?.user || !Permissions.canManageTeam(session.user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  const body = (await req.json()) as { data?: unknown }

  if (!isTeamHierarchyData(body.data)) {
    return NextResponse.json({ error: "invalid-team-payload" }, { status: 400 })
  }

  try {
    const data = await saveTeamHierarchyData(body.data)
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: "team-storage-unavailable" }, { status: 500 })
  }
}

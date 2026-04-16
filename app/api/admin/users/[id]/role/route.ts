import type { Role } from "@prisma/client"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Permissions } from "@/lib/permissions"

const validRoles: Role[] = ["MEMBER", "MAINTAINER", "ADMIN"]

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || !Permissions.canManageUsers(session.user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  const { id } = await context.params

  if (session.user.id === id) {
    return NextResponse.json({ error: "cannot-modify-self" }, { status: 400 })
  }

  const body = (await req.json()) as { role?: Role }
  const role = body.role

  if (!role || !validRoles.includes(role)) {
    return NextResponse.json({ error: "invalid-role" }, { status: 400 })
  }

  const user = await db.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  })

  return NextResponse.json({ user })
}

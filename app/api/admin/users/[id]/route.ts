import type { Role } from "@prisma/client"
import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Permissions } from "@/lib/permissions"

const validRoles: Role[] = ["MEMBER", "MAINTAINER", "ADMIN"]

const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  role: z.enum(["MEMBER", "MAINTAINER", "ADMIN"]).optional(),
})

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth()

  if (!session?.user || !Permissions.canManageUsers(session.user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  const { id } = await context.params

  const body = (await req.json().catch(() => null)) as unknown
  const parsed = updateUserSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid-user-payload" }, { status: 400 })
  }

  const normalizedEmail = parsed.data.email.toLowerCase()
  const incomingRole = parsed.data.role

  if (incomingRole && !validRoles.includes(incomingRole)) {
    return NextResponse.json({ error: "invalid-role" }, { status: 400 })
  }

  if (session.user.id === id && incomingRole && incomingRole !== session.user.role) {
    return NextResponse.json({ error: "cannot-modify-self-role" }, { status: 400 })
  }

  try {
    const user = await db.user.update({
      where: { id },
      data: {
        name: parsed.data.name,
        email: normalizedEmail,
        ...(incomingRole ? { role: incomingRole } : {}),
      },
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

    return NextResponse.json({ user })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "email-already-in-use" }, { status: 409 })
    }

    return NextResponse.json({ error: "update-failed" }, { status: 500 })
  }
}

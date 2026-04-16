import { NextResponse } from "next/server"
import { EventCategory } from "@prisma/client"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Permissions } from "@/lib/permissions"

const createEventSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().min(1),
  longDescription: z.string().optional().default(""),
  date: z.string().min(1),
  timeLabel: z.string().optional().default(""),
  location: z.string().min(1),
  spotsTotal: z.string().optional().default(""),
  externalFormUrl: z.string().optional().default(""),
  tags: z.string().optional().default(""),
  requiresRvuEmail: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
})

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user || !Permissions.canManageEvents(session.user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  const json = await req.json()
  const parsed = createEventSchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid-payload", details: parsed.error.flatten() }, { status: 400 })
  }

  const payload = parsed.data

  const date = new Date(payload.date)
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "invalid-date" }, { status: 400 })
  }

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const event = await db.event.create({
    data: {
      title: payload.title,
      slug: payload.slug,
      description: payload.description,
      longDescription: payload.longDescription || null,
      date,
      timeLabel: payload.timeLabel || null,
      location: payload.location,
      category: EventCategory.OTHER,
      spotsTotal: payload.spotsTotal ? Number(payload.spotsTotal) : null,
      tags: payload.tags
        ? payload.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
      requiresRvuEmail: payload.requiresRvuEmail,
      isPublished: payload.isPublished,
      isFeatured: payload.isFeatured,
      isPast: date.getTime() < now.getTime(),
      externalFormUrl: payload.externalFormUrl || null,
      createdById: session.user.id,
    },
    select: {
      id: true,
      slug: true,
      title: true,
    },
  })

  return NextResponse.json({ event }, { status: 201 })
}

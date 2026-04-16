import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { checkRegistrationEligibility } from "@/lib/registration"

export async function POST(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: "not-signed-in" }, { status: 401 })
  }

  const { id } = await context.params

  const event = await db.event.findUnique({
    where: { id },
  })

  if (!event || !event.isPublished) {
    return NextResponse.json({ error: "event-not-found" }, { status: 404 })
  }

  const eligibility = await checkRegistrationEligibility(event, session.user.id, session.user.email ?? undefined)

  if (!eligibility.eligible) {
    return NextResponse.json({ error: eligibility.reason }, { status: 403 })
  }

  const registration = await db.eventRegistration.create({
    data: {
      userId: session.user.id,
      eventId: event.id,
      status: "CONFIRMED",
    },
  })

  return NextResponse.json({ success: true, registration })
}

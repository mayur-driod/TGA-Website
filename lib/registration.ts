import type { Event } from "@prisma/client"

import { db } from "@/lib/db"
import { Permissions } from "@/lib/permissions"

export type RegistrationEligibility =
  | { eligible: true }
  | {
      eligible: false
      reason: "not-signed-in" | "not-rvu-email" | "event-full" | "already-registered" | "registration-closed"
    }

export async function checkRegistrationEligibility(
  event: Event,
  userId?: string,
  userEmail?: string
): Promise<RegistrationEligibility> {
  if (!event.isPublished || event.isPast) {
    return { eligible: false, reason: "registration-closed" }
  }

  if (!userId || !userEmail) {
    return { eligible: false, reason: "not-signed-in" }
  }

  if (!Permissions.canRegisterForEvent(userEmail, event.requiresRvuEmail)) {
    return { eligible: false, reason: "not-rvu-email" }
  }

  const existing = await db.eventRegistration.findUnique({
    where: { userId_eventId: { userId, eventId: event.id } },
  })

  if (existing) {
    return { eligible: false, reason: "already-registered" }
  }

  if (event.spotsTotal !== null) {
    const count = await db.eventRegistration.count({
      where: {
        eventId: event.id,
        status: "CONFIRMED",
      },
    })

    if (count >= event.spotsTotal) {
      return { eligible: false, reason: "event-full" }
    }
  }

  return { eligible: true }
}

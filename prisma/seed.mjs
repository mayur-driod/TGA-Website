import { PrismaClient, EventCategory } from "@prisma/client"
import { readFile } from "node:fs/promises"

const db = new PrismaClient()

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL

  if (!email) {
    return
  }

  await db.user.upsert({
    where: { email: email.toLowerCase() },
    update: {
      role: "ADMIN",
      name: process.env.ADMIN_NAME ?? "TGA Admin",
    },
    create: {
      email: email.toLowerCase(),
      name: process.env.ADMIN_NAME ?? "TGA Admin",
      role: "ADMIN",
    },
  })
}

async function seedEvents() {
  const raw = await readFile(new URL("../data/events.json", import.meta.url), "utf-8")
  const events = JSON.parse(raw)

  for (const event of events) {
    const date = new Date(event.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await db.event.upsert({
      where: { slug: event.slug },
      update: {
        title: event.title,
        description: event.shortDescription,
        longDescription: event.fullDescription,
        date,
        timeLabel: event.time,
        location: event.location,
        category: EventCategory.OTHER,
        spotsTotal: event.spotsTotal,
        tags: event.tags,
        isFeatured: Boolean(event.featured),
        isPublished: event.isPublished ?? true,
        isPast: date.getTime() < today.getTime(),
        requiresRvuEmail: event.requiresRvuEmail ?? true,
        externalFormUrl: event.externalFormUrl ?? event.registrationUrl ?? null,
      },
      create: {
        slug: event.slug,
        title: event.title,
        description: event.shortDescription,
        longDescription: event.fullDescription,
        date,
        timeLabel: event.time,
        location: event.location,
        category: EventCategory.OTHER,
        spotsTotal: event.spotsTotal,
        tags: event.tags,
        isFeatured: Boolean(event.featured),
        isPublished: event.isPublished ?? true,
        isPast: date.getTime() < today.getTime(),
        requiresRvuEmail: event.requiresRvuEmail ?? true,
        externalFormUrl: event.externalFormUrl ?? event.registrationUrl ?? null,
      },
    })
  }
}

async function main() {
  await seedAdmin()
  await seedEvents()
  console.log("Seeding completed.")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })

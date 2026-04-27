import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/lib/db"
import { rateLimit } from "@/lib/rate-limit"

const signUpSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
})

export async function POST(request: NextRequest) {
  const forwardedIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  const realIp = request.headers.get("x-real-ip")?.trim()
  const cfConnectingIp = request.headers.get("cf-connecting-ip")?.trim()
  const runtimeIp = (request as NextRequest & { ip?: string }).ip?.trim()

  const anonymousFingerprint = [
    request.headers.get("user-agent")?.trim() || "unknown-agent",
    request.headers.get("accept-language")?.trim() || "unknown-lang",
  ]
    .join("|")
    .slice(0, 200)

  const clientKey =
    runtimeIp || forwardedIp || realIp || cfConnectingIp || `anonymous:${anonymousFingerprint}`

  const { success, limit, remaining, reset } = await rateLimit.limit(`auth-signup:${clientKey}`)

  const rateLimitHeaders = {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": reset.toString(),
  }

  if (!success) {
    const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000))

    return NextResponse.json(
      {
        ok: false,
        code: "RATE_LIMITED",
        message: "Too many signup attempts. Please try again later.",
      },
      {
        status: 429,
        headers: {
          ...rateLimitHeaders,
          "Retry-After": retryAfterSeconds.toString(),
        },
      }
    )
  }

  const payload = await request.json().catch(() => null)
  const parsed = signUpSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        code: "INVALID_INPUT",
        message: "Please provide a valid name and email address.",
      },
      {
        status: 400,
        headers: rateLimitHeaders,
      }
    )
  }

  const normalizedEmail = parsed.data.email.toLowerCase()

  try {
    const user = await db.user.upsert({
      where: {
        email: normalizedEmail,
      },
      create: {
        email: normalizedEmail,
        name: parsed.data.name,
      },
      // Do not overwrite existing profiles before ownership is verified via magic link.
      update: {},
      select: {
        id: true,
      },
    })

    await db.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: "nodemailer",
          providerAccountId: normalizedEmail,
        },
      },
      update: {
        userId: user.id,
        type: "email",
      },
      create: {
        userId: user.id,
        type: "email",
        provider: "nodemailer",
        providerAccountId: normalizedEmail,
      },
      select: {
        id: true,
      },
    })

    return NextResponse.json(
      {
        ok: true,
      },
      {
        status: 200,
        headers: rateLimitHeaders,
      }
    )
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "SIGNUP_FAILED",
        message: "We couldn't create your account right now. Please try again.",
      },
      {
        status: 500,
        headers: rateLimitHeaders,
      }
    )
  }
}

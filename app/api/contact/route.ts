import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { z } from "zod"

import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants"
import { rateLimit } from "@/lib/rate-limit"

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  organization: z.string().trim().max(120).optional(),
  subject: z.string().trim().max(140).optional(),
  message: z.string().trim().min(10).max(5000),

  // Honeypot field
  website: z.string().optional(),
})

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function buildContactHtml(input: {
  name: string
  email: string
  organization?: string
  subject?: string
  message: string
  submittedAt: string
}) {
  const safeName = escapeHtml(input.name)
  const safeEmail = escapeHtml(input.email)
  const safeOrg = escapeHtml(input.organization || "-")
  const safeSubject = escapeHtml(input.subject || "Website contact message")
  const safeSubmittedAt = escapeHtml(input.submittedAt)
  const safeMessage = escapeHtml(input.message).replace(/\n/g, "<br />")

  return `
  <div style="background:#f5f7f2;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:700px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:20px 24px;background:#3b6d11;color:#ffffff;">
          <h2 style="margin:0;font-size:20px;line-height:1.3;">New Contact Message</h2>
          <p style="margin:6px 0 0 0;font-size:13px;opacity:0.9;">${escapeHtml(SITE_NAME)} website submission</p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;width:160px;font-size:13px;color:#6b7280;">Name</td>
              <td style="padding:8px 0;font-size:14px;font-weight:600;color:#111827;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;width:160px;font-size:13px;color:#6b7280;">Email</td>
              <td style="padding:8px 0;font-size:14px;color:#111827;">
                <a href="mailto:${safeEmail}" style="color:#1d4ed8;text-decoration:none;">${safeEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;width:160px;font-size:13px;color:#6b7280;">Organization</td>
              <td style="padding:8px 0;font-size:14px;color:#111827;">${safeOrg}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;width:160px;font-size:13px;color:#6b7280;">Subject</td>
              <td style="padding:8px 0;font-size:14px;color:#111827;">${safeSubject}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;width:160px;font-size:13px;color:#6b7280;">Submitted</td>
              <td style="padding:8px 0;font-size:14px;color:#111827;">${safeSubmittedAt}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 24px 24px;">
          <div style="border:1px solid #e5e7eb;border-radius:10px;padding:14px;background:#fafafa;">
            <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;">Message</p>
            <p style="margin:0;font-size:14px;line-height:1.6;color:#111827;">${safeMessage}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 24px 24px;">
          <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(
            input.subject || "Your message to The Green Alliance"
          )}" style="display:inline-block;padding:10px 14px;border-radius:8px;background:#3b6d11;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;">Reply to sender</a>
          <p style="margin:10px 0 0 0;font-size:12px;color:#6b7280;">Tip: Reply-To is automatically set to the sender email.</p>
        </td>
      </tr>
    </table>
  </div>
  `
}

function buildContactText(input: {
  name: string
  email: string
  organization?: string
  subject?: string
  message: string
  submittedAt: string
}) {
  return [
    `New contact message from ${SITE_NAME}`,
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Organization: ${input.organization || "-"}`,
    `Subject: ${input.subject || "Website contact message"}`,
    `Submitted: ${input.submittedAt}`,
    "",
    "Message:",
    input.message,
  ].join("\n")
}

export async function POST(request: NextRequest) {
  /* ----------------------------- */
  /* Rate Limiting                */
  /* ----------------------------- */

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

  const { success, limit, remaining, reset } = await rateLimit.limit(clientKey)

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
        message: "Too many messages sent. Please try again later.",
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

  /* ----------------------------- */
  /* Parse + Validate             */
  /* ----------------------------- */

  const payload = await request.json().catch(() => null)
  const parsed = contactSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please provide a valid name, email, and message.",
      },
      {
        status: 400,
        headers: rateLimitHeaders,
      }
    )
  }

  /* ----------------------------- */
  /* Honeypot Check               */
  /* ----------------------------- */

  if (parsed.data.website?.trim()) {
    return NextResponse.json(
      {
        ok: false,
        message: "Spam detected.",
      },
      {
        status: 400,
        headers: rateLimitHeaders,
      }
    )
  }

  const smtpHost = process.env.AUTH_SMTP_HOST
  const smtpPort = Number(process.env.AUTH_SMTP_PORT ?? "587")
  const smtpUser = process.env.AUTH_SMTP_USER
  const smtpPass = process.env.AUTH_SMTP_PASS
  const emailFrom = process.env.AUTH_EMAIL_FROM || smtpUser

  if (!smtpHost || !smtpUser || !smtpPass || !emailFrom) {
    return NextResponse.json(
      {
        ok: false,
        message: "Contact email is not configured yet. Please try again later.",
      },
      {
        status: 500,
        headers: rateLimitHeaders,
      }
    )
  }

  const submittedAt = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  })

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })

  const subjectSuffix =
    parsed.data.subject?.trim() || "Website contact message"

  try {
    await transporter.sendMail({
      from: emailFrom,
      to: CONTACT_EMAIL,
      replyTo: {
        name: parsed.data.name,
        address: parsed.data.email,
      },
      subject: `[TGA Contact] ${subjectSuffix}`,
      text: buildContactText({
        ...parsed.data,
        submittedAt,
      }),
      html: buildContactHtml({
        ...parsed.data,
        submittedAt,
      }),
    })

    return NextResponse.json(
      {
        ok: true,
        message: "Message sent successfully.",
      },
      { headers: rateLimitHeaders }
    )
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Unable to send your message at the moment. Please try again shortly.",
      },
      {
        status: 500,
        headers: rateLimitHeaders,
      }
    )
  }
}
"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import ContactForm from "@/components/common/ContactForm"
import SectionLabel from "@/components/common/SectionLabel"
import { RVU_EMAIL_DOMAIN, WHATSAPP_COMMUNITY_URL } from "@/lib/constants"

export default function JoinSection() {
  const { data: session } = useSession()

  const role = session?.user?.role
  const normalizedEmail = session?.user?.email?.toLowerCase() ?? ""
  const isRvuVerified = normalizedEmail.endsWith(RVU_EMAIL_DOMAIN)
  const canViewWhatsapp = Boolean(session?.user && (isRvuVerified || role === "ADMIN" || role === "MAINTAINER"))

  return (
    <section id="contact" className="scroll-mt-24 bg-secondary/40 px-4 py-20 md:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <SectionLabel>Contact</SectionLabel>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Get in
          <span className="relative mx-2 inline-block px-1.5">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-1 h-3.5 -rotate-1 rounded-md bg-primary/10"
            />
            <span className="relative text-green-500 font-bold">touch</span>
          </span>
          with us
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Have a collaboration idea, event proposal, or question? Send us a message and our team will reply to you by email.
        </p>

        <div className="mt-8 w-full text-left">
          <ContactForm />
        </div>

        {canViewWhatsapp ? (
          <Link
            href={WHATSAPP_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-sm font-medium text-primary hover:underline"
          >
            Or join our WhatsApp community {"->"}
          </Link>
        ) : (
          <p className="mt-4 text-xs text-muted-foreground">
            WhatsApp community access is limited to verified RVU members and club admins.
          </p>
        )}
      </div>
    </section>
  )
}

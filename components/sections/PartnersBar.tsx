import Image from "next/image"
import {
  COMMUNITY_PLATFORMS,
  PARTNERS,
  PARENT_ORGANISATION,
} from "@/lib/constants"

export default function PartnersBar() {
  return (
    <section className="border-y border-border bg-background px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Core Partnerships
          </p>
          <h2 className="text-lg font-semibold text-foreground sm:text-xl md:text-2xl">
            Collaborating with Ataavi Bird Foundation and NCF
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            These are our two key conservation partners for field learning, biodiversity documentation, and student-led impact.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {PARTNERS.map((partner) => {
            const isExternal = partner.url.startsWith("http")

            return (
              <a
                key={partner.name}
                href={partner.url}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card px-4 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary/20 via-primary/60 to-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="mb-3 inline-flex rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                  {partner.featured ? "Main partner" : "Partner"}
                </div>

                <div className="relative mb-3 h-16 w-full rounded-lg bg-muted/25 p-2 sm:h-20">
                  <Image
                    src={partner.logoSrc}
                    alt={partner.logoAlt}
                    fill
                    className="object-contain p-1"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>

                <p className="text-base font-semibold text-foreground">{partner.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {partner.tagline ?? "Conservation and student engagement collaboration"}
                </p>
                <p className="mt-3 text-xs font-medium text-primary transition-transform duration-300 group-hover:translate-x-1">
                  Explore organisation
                </p>
              </a>
            )
          })}
        </div>

        <div className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2 sm:items-center md:grid-cols-[1.3fr_1fr]">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Parent Organisation
            </p>
            <h3 className="text-lg font-semibold text-foreground">{PARENT_ORGANISATION.name}</h3>
            <p className="text-sm text-muted-foreground">{PARENT_ORGANISATION.description}</p>
            <a
              href={PARENT_ORGANISATION.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex pt-1 text-xs font-medium text-primary transition-colors hover:text-foreground"
            >
              Visit RV University
            </a>
          </div>

          <a
            href={PARENT_ORGANISATION.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block rounded-xl bg-muted/25 p-3 transition-colors hover:bg-muted/35"
          >
            <div className="relative h-20 w-full">
              <Image
                src={PARENT_ORGANISATION.logoSrc}
                alt={PARENT_ORGANISATION.logoAlt}
                fill
                loading="eager"
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 24vw"
              />
            </div>
          </a>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Citizen Science Platforms
          </p>
          <div className="flex flex-wrap gap-3">
            {COMMUNITY_PLATFORMS.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:text-foreground"
              >
                <span className="relative block h-7 w-7 overflow-hidden rounded-full bg-muted/30">
                  <Image
                    src={platform.logoSrc}
                    alt={platform.logoAlt}
                    fill
                    className="object-contain p-1"
                    sizes="28px"
                  />
                </span>
                <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground sm:text-sm">
                  {platform.shortName}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

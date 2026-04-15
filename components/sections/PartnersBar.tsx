import { PARTNERS } from "@/lib/constants"

export default function PartnersBar() {
  return (
    <section className="border-y border-border px-4 py-6 md:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3">
        <p className="mr-1 text-xs text-muted-foreground">Associated with</p>
        {PARTNERS.map((partner) => {
          const isExternal = partner.url.startsWith("http")

          return (
            <a
              key={partner.name}
              href={partner.url}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="inline-flex rounded-full border border-border px-5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {partner.shortName}
            </a>
          )
        })}
      </div>
    </section>
  )
}

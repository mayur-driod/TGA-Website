import Image from "next/image"
import { ImageIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { TeamCommittee } from "@/lib/types"

type CommitteeCardProps = {
  committee: TeamCommittee
  revealIndex?: number
}

export default function CommitteeCard({ committee, revealIndex = 0 }: CommitteeCardProps) {
  const cardDelay = `${revealIndex * 70}ms`
  const hasBannerImage = Boolean(committee.imageUrl)

  return (
    <>
      <article
        tabIndex={0}
        className="rounded-2xl border border-border/70 bg-card shadow-[0_18px_30px_-26px_rgba(0,0,0,0.55)] md:hidden"
        style={{ transitionDelay: cardDelay }}
      >
        <div className="relative aspect-5/3 overflow-hidden rounded-t-2xl border-b border-border/70">
          {hasBannerImage ? (
            <Image
              src={committee.imageUrl!}
              alt={`${committee.name} activity`}
              fill
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-amber-200/80 via-amber-100/75 to-background" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/85">Committee</p>
            <h3 className="mt-1 text-lg font-semibold leading-tight text-white">{committee.name}</h3>
          </div>
        </div>

        <div className="space-y-3 p-3.5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-amber-800/85">{committee.focus}</p>
          <p className="text-sm leading-6 text-muted-foreground">{committee.description}</p>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Leads</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {committee.leads.map((lead) => (
                <Badge key={`${committee.id}-${lead}`} variant="outline" className="border-amber-200 bg-amber-50/60 text-amber-900">
                  {lead}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </article>

      <article
        tabIndex={0}
        className="group/committee hidden rounded-2xl border border-border/70 bg-card shadow-[0_18px_30px_-26px_rgba(0,0,0,0.55)] transition-[transform,box-shadow,border-color] duration-500 ease-out md:block md:perspective-distant md:hover:-translate-y-1 md:focus-visible:-translate-y-1 md:hover:shadow-xl md:focus-visible:shadow-xl"
        style={{ transitionDelay: cardDelay }}
      >
        <div className="relative h-[22rem] overflow-hidden rounded-2xl">
          <div className="relative h-full w-full transform-3d transition-transform duration-700 ease-out md:group-hover/committee:transform-[rotateY(180deg)] md:group-focus-visible/committee:transform-[rotateY(180deg)]">
            <div className="absolute inset-0 z-20 rounded-2xl backface-hidden">
              <div className="relative h-full w-full overflow-hidden rounded-2xl">
                {hasBannerImage ? (
                  <Image
                    src={committee.imageUrl!}
                    alt={`${committee.name} activity`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out md:group-hover/committee:scale-[1.03] md:group-focus-visible/committee:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-amber-300/75 via-amber-100/70 to-background">
                    <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-amber-200/70 blur-2xl" />
                    <div className="absolute -bottom-14 -left-12 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-background/75 px-3 py-1.5 text-xs font-medium text-amber-900 backdrop-blur-xs">
                        <ImageIcon className="size-3.5" aria-hidden />
                        Committee Visual
                      </span>
                    </div>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/12 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/85">Committee</p>
                  <h3 className="mt-1 text-xl font-semibold leading-tight text-white">{committee.name}</h3>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-amber-100/95">{committee.focus}</p>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 z-10 flex h-full flex-col rounded-2xl border border-border/70 bg-background p-4 backface-hidden transform-[rotateY(180deg)]">
              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">What We Do</p>
                <h3 className="mt-1 text-lg font-semibold leading-tight text-foreground">{committee.name}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-amber-800/85">{committee.focus}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{committee.description}</p>

                <div className="mt-3 border-t border-border/70 pt-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Leads</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {committee.leads.map((lead) => (
                      <Badge key={`${committee.id}-${lead}`} variant="outline" className="border-amber-200 bg-amber-50/60 text-amber-900">
                        {lead}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}

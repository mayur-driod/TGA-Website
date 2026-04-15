import Link from "next/link"
import SectionLabel from "@/components/common/SectionLabel"
import biodiversityData from "@/data/biodiversity.json"
import type { BiodiversityData } from "@/lib/types"

const mosaicClasses = [
  "bg-forest-100/70",
  "bg-forest-200/55",
  "bg-forest-50",
  "bg-forest-400/40",
  "bg-forest-100/60",
  "bg-forest-200/40",
  "bg-forest-50",
  "bg-forest-400/45",
  "bg-forest-50",
  "bg-forest-100/80",
  "bg-forest-200/45",
  "bg-forest-400/35",
  "bg-forest-200/55",
  "bg-forest-50",
  "bg-forest-100/50",
  "bg-forest-400/30",
]

export default function BiodiversityPreview() {
  const data = biodiversityData as BiodiversityData

  return (
    <section className="px-4 py-14 md:px-8 md:py-16 lg:px-12">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <SectionLabel>Biodiversity assessment</SectionLabel>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Mapping life on our campus
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Our student teams track species across the RVU campus using field transects and iNaturalist observations to build a reliable biodiversity baseline.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {data.groups.map((group) => (
              <span
                key={group.name}
                className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
              >
                {group.name}: {group.count}
              </span>
            ))}
          </div>

          <Link href="/biodiversity" className="mt-6 inline-flex text-sm font-medium text-primary hover:underline">
            Explore the assessment {"->"}
          </Link>
        </div>

        <div>
          <div className="grid grid-cols-4 gap-2 rounded-2xl border border-border bg-card p-3">
            {mosaicClasses.map((className, index) => (
              <div key={`${className}-${index}`} className={`aspect-square rounded-md ${className}`} />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Ongoing · iNaturalist + field surveys</p>
        </div>
      </div>
    </section>
  )
}

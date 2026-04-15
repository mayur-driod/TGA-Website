import Link from "next/link"
import { Suspense } from "react"
import SectionLabel from "@/components/common/SectionLabel"
import ObservationTile from "@/components/sections/ObservationTile"
import { INATURALIST_PROJECT_URL } from "@/lib/constants"

const INATURALIST_PREVIEW_URL =
  "https://api.inaturalist.org/v1/observations?project_id=wildlife-of-rv-university&per_page=12"
const INATURALIST_API_DOCS_URL = "https://api.inaturalist.org/v1/docs/"

type INaturalistPhoto = {
  url?: string
}

type INaturalistTaxon = {
  id?: number
  name?: string
  iconic_taxon_name?: string
}

type INaturalistUser = {
  id?: number
  login?: string
}

type INaturalistObservation = {
  id: number
  observed_on?: string
  observed_on_string?: string
  species_guess?: string
  photos?: INaturalistPhoto[]
  taxon?: INaturalistTaxon
  user?: INaturalistUser
}

type INaturalistResponse = {
  total_results: number
  results: INaturalistObservation[]
}

type ObservationCardData = {
  id: number
  speciesName: string
  observedDate: string
  reporterName: string
  imageUrl: string | null
}

type BiodiversityPreviewData = {
  totalObservations: number
  uniqueSpecies: number
  observationsWithPhotos: number
  uniqueObservers: number
  groupTags: Array<{ name: string; count: number }>
  observations: ObservationCardData[]
}

function formatDate(dateValue?: string) {
  if (!dateValue) return "Date unavailable"

  const parsedDate = new Date(dateValue)
  if (Number.isNaN(parsedDate.getTime())) return dateValue

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function getMediumImageUrl(photoUrl?: string) {
  if (!photoUrl) return null
  return photoUrl.replace("/square.", "/medium.")
}

async function getBiodiversityPreviewData(): Promise<
  { data: BiodiversityPreviewData; error: null } | { data: null; error: string }
> {
  try {
    const response = await fetch(INATURALIST_PREVIEW_URL, {
      next: { revalidate: 1800 },
    })

    if (!response.ok) {
      return { data: null, error: "Unable to load live biodiversity data right now." }
    }

    const payload = (await response.json()) as INaturalistResponse
    const results = Array.isArray(payload.results) ? payload.results : []

    const sortedByImage = [...results].sort((a, b) => {
      const aHasImage = Boolean(a.photos?.[0]?.url)
      const bHasImage = Boolean(b.photos?.[0]?.url)
      return Number(bHasImage) - Number(aHasImage)
    })

    const speciesSet = new Set<string>()
    const observersSet = new Set<string>()
    const groupsMap = new Map<string, number>()
    let photosCount = 0

    for (const observation of results) {
      const taxonId = observation.taxon?.id
      const taxonName = observation.taxon?.name ?? observation.species_guess

      if (typeof taxonId === "number") {
        speciesSet.add(`id:${taxonId}`)
      } else if (taxonName) {
        speciesSet.add(`name:${taxonName.toLowerCase()}`)
      }

      const observerKey =
        observation.user?.id !== undefined
          ? `id:${observation.user.id}`
          : observation.user?.login
            ? `login:${observation.user.login}`
            : null

      if (observerKey) {
        observersSet.add(observerKey)
      }

      if (observation.photos?.[0]?.url) {
        photosCount += 1
      }

      const iconicTaxon = observation.taxon?.iconic_taxon_name
      if (iconicTaxon) {
        groupsMap.set(iconicTaxon, (groupsMap.get(iconicTaxon) ?? 0) + 1)
      }
    }

    const groupTags = [...groupsMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    const observations = sortedByImage.slice(0, 12).map((observation) => ({
      id: observation.id,
      speciesName: observation.taxon?.name ?? observation.species_guess ?? "Unidentified species",
      observedDate: formatDate(observation.observed_on ?? observation.observed_on_string),
      reporterName: observation.user?.login ? `Reported by @${observation.user.login}` : "Reported by community member",
      imageUrl: getMediumImageUrl(observation.photos?.[0]?.url),
    }))

    return {
      data: {
        totalObservations: payload.total_results ?? results.length,
        uniqueSpecies: speciesSet.size,
        observationsWithPhotos: photosCount,
        uniqueObservers: observersSet.size,
        groupTags,
        observations,
      },
      error: null,
    }
  } catch {
    return { data: null, error: "Live biodiversity feed is temporarily unavailable." }
  }
}

function BiodiversityPreviewSkeleton() {
  return (
    <section className="px-4 py-14 md:px-8 md:py-16 lg:px-12">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-5 w-full animate-pulse rounded bg-muted" />
          <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[...Array.from({ length: 4 })].map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-xl border border-border bg-card" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-2 sm:grid-cols-3 sm:gap-3 sm:p-3">
          {[...Array.from({ length: 6 })].map((_, index) => (
            <div key={index} className="aspect-square animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    </section>
  )
}

async function BiodiversityPreviewContent() {
  const response = await getBiodiversityPreviewData()

  if (response.error || !response.data) {
    return (
      <section className="px-4 py-14 md:px-8 md:py-16 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-card p-6">
          <SectionLabel>Biodiversity assessment</SectionLabel>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Mapping life on our campus
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {response.error} You can still explore the full project archive on iNaturalist.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/biodiversity" className="inline-flex text-sm font-medium text-primary hover:underline">
              Explore biodiversity page {"->"}
            </Link>
            <a
              href={INATURALIST_PROJECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm font-medium text-primary hover:underline"
            >
              Open iNaturalist project {"->"}
            </a>
            <a
              href={INATURALIST_API_DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm font-medium text-primary hover:underline"
            >
              iNaturalist API docs {"->"}
            </a>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Credits: Observation data and imagery are sourced from iNaturalist.
          </p>
        </div>
      </section>
    )
  }

  const { data } = response

  return (
    <section className="px-4 py-14 md:px-8 md:py-16 lg:px-12">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-12">
        <div>
          <SectionLabel>Biodiversity assessment</SectionLabel>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Mapping life on our campus
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            This preview is powered by live iNaturalist observations from the Wildlife of RV University project, giving a real-time view of what students are documenting on campus.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
            <div className="rounded-xl border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">Total observations</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{data.totalObservations}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">Unique species</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{data.uniqueSpecies}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">Observations with photos</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{data.observationsWithPhotos}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">Active observers</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{data.uniqueObservers}</p>
            </div>
          </div>

          {data.groupTags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {data.groupTags.map((group) => (
                <span
                  key={group.name}
                  className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
                >
                  {group.name}: {group.count}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/biodiversity" className="inline-flex text-sm font-medium text-primary hover:underline">
              Explore {data.totalObservations}+ observations {"->"}
            </Link>
            <a
              href={INATURALIST_PROJECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm font-medium text-primary hover:underline"
            >
              View project on iNaturalist {"->"}
            </a>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-2 sm:grid-cols-3 sm:gap-3 sm:p-3">
            {data.observations.map((observation) => (
              <ObservationTile
                key={observation.id}
                speciesName={observation.speciesName}
                observedDate={observation.observedDate}
                reporterName={observation.reporterName}
                imageUrl={observation.imageUrl}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Live feed by iNaturalist community contributors for the wildlife-of-rv-university project.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Credits: Powered by iNaturalist API ·
            <a
              href={INATURALIST_API_DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-primary hover:underline"
            >
              API documentation
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

export default function BiodiversityPreview() {
  return (
    <Suspense fallback={<BiodiversityPreviewSkeleton />}>
      <BiodiversityPreviewContent />
    </Suspense>
  )
}

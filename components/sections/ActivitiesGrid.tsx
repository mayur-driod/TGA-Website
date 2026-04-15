import ActivityCard from "@/components/cards/ActivityCard"
import SectionLabel from "@/components/common/SectionLabel"
import { ACTIVITIES } from "@/lib/constants"

export default function ActivitiesGrid() {
  return (
    <section className="px-4 py-14 md:px-8 md:py-16 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <SectionLabel>What we do</SectionLabel>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Conservation through community
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          From birdwatching to biodiversity documentation, TGA turns student energy into consistent on-ground environmental action.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {ACTIVITIES.map((activity, index) => (
            <ActivityCard key={activity.id} activity={activity} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

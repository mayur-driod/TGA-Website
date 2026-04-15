import AnimatedCounter from "@/components/common/AnimatedCounter"
import { STATS } from "@/lib/constants"

export default function StatsBar() {
  return (
    <section className="border-y border-border/80 bg-background px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 divide-x divide-y divide-border/70 border border-border/70 md:grid-cols-4 md:divide-y-0">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center justify-center gap-1 px-3 py-6 text-center md:px-4">
            <p className="text-3xl font-medium text-forest-600">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

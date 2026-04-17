import Link from "next/link"
import { Compass, Leaf, Sparkles, Users } from "lucide-react"

import TeamCard from "@/components/cards/TeamCard"
import PageHeader from "@/components/common/PageHeader"
import SectionLabel from "@/components/common/SectionLabel"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTeamHierarchyData } from "@/lib/team-content"

const TEAM_SECTION_LINKS = [
  {
    id: "advisors",
    label: "Student Advisors",
    chipClass: "border-forest-200 bg-forest-50/75 text-forest-800 hover:bg-forest-100/80",
  },
  {
    id: "leadership",
    label: "Core Leadership",
    chipClass: "border-teal-200 bg-teal-50/75 text-teal-800 hover:bg-teal-100/80",
  },
  {
    id: "committees",
    label: "Committees",
    chipClass: "border-amber-200 bg-amber-50/75 text-amber-800 hover:bg-amber-100/80",
  },
  {
    id: "faculty",
    label: "Faculty Mentors",
    chipClass: "border-primary/25 bg-primary/10 text-primary hover:bg-primary/15",
  },
] as const

export default async function TeamPage() {
  const team = await getTeamHierarchyData()

  return (
    <main className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-28 h-64 w-64 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute -right-28 top-136 h-72 w-72 rounded-full bg-teal-100/50 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-60 w-60 rounded-full bg-amber-100/55 blur-3xl" />
      </div>

      <PageHeader
        badge="People & Purpose"
        title="The people growing The Green Alliance"
        subtitle="Meet our student advisors, leadership core, committees, and faculty mentors."
      />

      <section className="px-4 py-6 md:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <nav className="flex flex-wrap items-center gap-2">
            {TEAM_SECTION_LINKS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${item.chipClass}`}
              >
                <Compass className="size-3" aria-hidden />
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section
        id="advisors"
        className="scroll-mt-24 border-y border-forest-100/70 bg-linear-to-b from-forest-50/65 via-background to-background px-4 py-10 md:px-8 lg:px-12"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <SectionLabel className="text-forest-700">Student Advisors</SectionLabel>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Senior guidance for the leadership team
              </h3>
            </div>
            <Badge variant="secondary" className="border border-forest-200 bg-forest-100/70 text-forest-800">
              <Sparkles className="size-3" aria-hidden />
              {team.studentAdvisors.filter((member) => member.isFounder).length} founders in this group
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {team.studentAdvisors.map((member) => (
              <TeamCard key={member.id} member={member} tone="advisor" />
            ))}
          </div>
        </div>
      </section>

      <section
        id="leadership"
        className="scroll-mt-24 border-y border-teal-100/70 bg-linear-to-b from-teal-50/60 via-secondary/15 to-background px-4 py-12 md:px-8 lg:px-12"
      >
        <div className="mx-auto w-full max-w-7xl">
          <SectionLabel className="text-teal-700">Leadership Core</SectionLabel>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Positions driving day-to-day momentum
          </h3>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {team.leadershipCore.map((member) => (
              <TeamCard key={member.id} member={member} tone="leadership" />
            ))}
          </div>
        </div>
      </section>

      <section
        id="committees"
        className="scroll-mt-24 border-y border-amber-100/70 bg-linear-to-b from-amber-50/55 via-background to-background px-4 py-12 md:px-8 lg:px-12"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-6">
            <SectionLabel className="text-amber-700">Committees</SectionLabel>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Teams that convert strategy into action
            </h3>
          </div>

          <Accordion type="multiple" className="space-y-3">
            {team.committees.map((committee) => (
              <AccordionItem key={committee.id} value={committee.id}>
                <AccordionTrigger className="rounded-t-xl px-5 text-base">
                  <div className="pr-2">
                    <p className="text-left font-semibold text-foreground">{committee.name}</p>
                    <p className="mt-1 text-left text-xs font-normal text-amber-800/85">{committee.focus}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 rounded-b-xl px-5 pb-5">
                  <p className="text-sm leading-7 text-muted-foreground">{committee.description}</p>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-amber-100 bg-amber-50/45 p-3">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Leads</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {committee.leads.map((lead) => (
                          <Badge key={`${committee.id}-${lead}`} variant="outline" className="border-amber-200 bg-background/85">
                            {lead}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-amber-100 bg-amber-50/45 p-3">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Open roles</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {committee.openRoles.map((role) => (
                          <Badge key={`${committee.id}-${role}`} className="bg-amber-100 text-amber-900" variant="secondary">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section
        id="faculty"
        className="scroll-mt-24 border-y border-primary/15 bg-linear-to-b from-primary/6 via-secondary/20 to-background px-4 py-12 md:px-8 lg:px-12"
      >
        <div className="mx-auto w-full max-w-7xl">
          <SectionLabel className="text-primary">Faculty Mentors</SectionLabel>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Academic guidance behind our student energy
          </h3>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {team.facultyMentors.map((member) => (
              <TeamCard key={member.id} member={member} tone="faculty" />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center rounded-2xl border border-border bg-card/85 px-6 py-8 text-center shadow-sm backdrop-blur-sm md:px-8">
          <Leaf className="size-6 text-primary" aria-hidden />
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">Want to be part of a committee?</h3>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Button asChild>
              <Link href="/#contact">
                <Users className="size-4" aria-hidden />
                Contact the team
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/events">Explore events</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

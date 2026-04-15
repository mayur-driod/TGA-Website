import type { ActivityItem, NavItem, Partner, StatItem } from "@/lib/types"

export const SITE_NAME = "The Green Alliance"
export const SITE_TAGLINE = "A student led initiative to raise awareness"
export const SITE_URL = "https://thegreenalliancervuniversity.vercel.app/"
export const RVU_EMAIL_DOMAIN = "@rvu.edu.in"
export const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/JfhVgBdd1wS0InWopFaBal?mode=gi_t"
export const INATURALIST_PROJECT_URL = "https://www.inaturalist.org/projects/wildlife-of-rv-university"

export const NAV_LINKS: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Biodiversity", href: "/biodiversity" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
]

export const STATS: StatItem[] = [
  { value: 120, suffix: "+", label: "Active members" },
  { value: 48, suffix: "", label: "Events conducted" },
  { value: 200, suffix: "+", label: "Species documented" },
  { value: 3, suffix: "", label: "Partner organisations" },
]

export const PARTNERS: Partner[] = [
  { name: "Ataavi Bird Foundation", shortName: "Ataavi", url: "#" },
  { name: "Nature Conservation Foundation", shortName: "NCF", url: "https://ncf-india.org" },
  { name: "RV University", shortName: "RVU", url: "https://rvu.edu.in" },
  { name: "eBird India", shortName: "eBird", url: "https://ebird.org/india" },
]

export const ACTIVITIES: ActivityItem[] = [
  {
    id: "birdwatching",
    title: "Birdwatching walks",
    description:
      "Weekly campus birding sessions and participation in the Great Backyard Bird Count and eBird events.",
    iconType: "bird",
    colorScheme: "forest",
    href: "/events?type=Birdwatch",
  },
  {
    id: "cleanup",
    title: "Cleanup drives",
    description:
      "Campus and city-wide waste collection drives in partnership with local organisations and municipal bodies.",
    iconType: "cleanup",
    colorScheme: "amber",
    href: "/events?type=Cleanup",
  },
  {
    id: "talks",
    title: "Expert talks",
    description:
      "Regular seminars from field ecologists, wildlife photographers, policy experts, and conservation scientists.",
    iconType: "talk",
    colorScheme: "teal",
    href: "/events?type=Talk",
  },
  {
    id: "biodiversity",
    title: "Biodiversity assessment",
    description:
      "Ongoing systematic documentation of flora and fauna on the RVU campus using iNaturalist and field surveys.",
    iconType: "biodiversity",
    colorScheme: "forest",
    href: "/biodiversity",
  },
  {
    id: "campaigns",
    title: "Awareness campaigns",
    description:
      "Social media drives, workshops, and on-campus installations around World Environment Day and Earth Day.",
    iconType: "campaign",
    colorScheme: "amber",
    href: "/blog",
  },
  {
    id: "global",
    title: "Global events",
    description:
      "TGA participates in GBBC, World Migratory Bird Day, and coordinates with Ataavi Bird Foundation and NCF.",
    iconType: "globe",
    colorScheme: "teal",
    href: "/events?type=Global+event",
  },
]

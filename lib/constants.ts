import type {
  ActivityItem,
  CommunityPlatform,
  NavItem,
  ParentOrganisation,
  Partner,
  StatItem,
} from "@/lib/types"

export const SITE_NAME = "The Green Alliance"
export const SITE_TAGLINE = "A student led initiative to raise awareness"
export const SITE_URL = "https://thegreenalliancervuniversity.vercel.app/"
export const CONTACT_EMAIL = "club_thegreenalliance@rvu.edu.in"
export const RVU_EMAIL_DOMAIN = "@rvu.edu.in"
export const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/JfhVgBdd1wS0InWopFaBal?mode=gi_t"
export const INATURALIST_PROJECT_URL = "https://www.inaturalist.org/projects/wildlife-of-rv-university"

export const NAV_LINKS: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Biodiversity", href: "/biodiversity" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/#contact" },
]

export const STATS: StatItem[] = [
  { value: 120, suffix: "+", label: "Active members" },
  { value: 48, suffix: "", label: "Events conducted" },
  { value: 200, suffix: "+", label: "Species documented" },
  { value: 2, suffix: "", label: "Core partner organisations" },
]

export const PARTNERS: Partner[] = [
  {
    name: "Ataavi Bird Foundation",
    shortName: "Ataavi",
    url: "https://ataavi.org/",
    logoSrc: "/assets/logo/Ataavi_Logo.png",
    logoAlt: "Ataavi Bird Foundation logo",
    tagline: "Grassroots birding and conservation education",
    featured: true,
  },
  {
    name: "Nature Conservation Foundation",
    shortName: "NCF",
    url: "https://ncf-india.org",
    logoSrc: "/assets/logo/NatureConservationFoundation.png",
    logoAlt: "Nature Conservation Foundation logo",
    tagline: "Research-driven biodiversity and ecosystem conservation",
    featured: true,
  },
]

export const PARENT_ORGANISATION: ParentOrganisation = {
  name: "RV University",
  shortName: "RVU",
  url: "https://rvu.edu.in",
  logoSrc: "/assets/logo/RV_University_Logo.png",
  logoAlt: "RV University logo",
  description:
    "The Green Alliance operates as a student initiative under RV University, Bengaluru, with guidance, academic support, and institutional backing.",
}

export const COMMUNITY_PLATFORMS: CommunityPlatform[] = [
  {
    name: "eBird India",
    shortName: "eBird",
    url: "https://ebird.org/hotspot/L22401771",
    logoSrc: "/assets/logo/Ebird.png",
    logoAlt: "eBird logo",
  },
  {
    name: "iNaturalist",
    shortName: "iNaturalist",
    url: "https://www.inaturalist.org/projects/wildlife-of-rv-university",
    logoSrc: "/assets/logo/INaturalist.png",
    logoAlt: "iNaturalist logo",
  },
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

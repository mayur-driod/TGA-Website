export interface Event {
  id: string
  slug: string
  title: string
  type: "Birdwatch" | "Cleanup" | "Talk" | "Workshop" | "Campaign" | "Global event"
  date: string
  time: string
  location: string
  shortDescription: string
  fullDescription: string
  spotsTotal: number
  spotsLeft: number
  registrationUrl?: string
  coverImage: string
  tags: string[]
  featured: boolean
  requiresRvuEmail?: boolean
  isPublished?: boolean
  isPast?: boolean
  externalFormUrl?: string | null
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  authorRole: string
  date: string
  coverImage: string
  tags: string[]
  readingTimeMinutes: number
}

export interface Member {
  id: string
  name: string
  role: string
  department: string
  year: string | null
  bio: string
  avatar: string
  interests: string[]
  instagram: string | null
  email: string | null
}

export interface TeamData {
  students: Member[]
  faculty: Member[]
}

export interface TeamMemberProfile {
  id: string
  name: string
  role: string
  department: string
  year: string | null
  bio: string
  avatar: string
  imageUrl?: string | null
  focusAreas: string[]
  socials: TeamSocialLink[]
  isFounder?: boolean
}

export interface TeamSocialLink {
  platform: "linkedin" | "x" | "instagram" | "email" | "website" | "other"
  url: string
}

export interface TeamCommittee {
  id: string
  name: string
  description: string
  focus: string
  leads: string[]
  openRoles: string[]
}

export interface TeamHierarchyData {
  studentAdvisors: TeamMemberProfile[]
  leadershipCore: TeamMemberProfile[]
  committees: TeamCommittee[]
  facultyMentors: TeamMemberProfile[]
}

export interface BiodiversityGroup {
  name: string
  count: number
  icon: string
  highlight: string
  color: string
}

export interface BiodiversityObservation {
  species: string
  commonName: string
  date: string
  observer: string
  imageUrl: string | null
}

export interface BiodiversityData {
  lastUpdated: string
  totalSpecies: number
  iNaturalistProjectUrl: string
  groups: BiodiversityGroup[]
  recentObservations: BiodiversityObservation[]
}

export interface NavItem {
  label: string
  href: string
  external?: boolean
}

export interface ActivityItem {
  id: string
  title: string
  description: string
  iconType: "bird" | "cleanup" | "talk" | "biodiversity" | "campaign" | "globe"
  colorScheme: "forest" | "amber" | "teal"
  href: string
}

export interface StatItem {
  value: number
  suffix: string
  label: string
}

export interface Partner {
  name: string
  shortName: string
  url: string
  logoSrc: string
  logoAlt: string
  tagline?: string
  featured?: boolean
}

export interface ParentOrganisation {
  name: string
  shortName: string
  url: string
  logoSrc: string
  logoAlt: string
  description: string
}

export interface CommunityPlatform {
  name: string
  shortName: string
  url: string
  logoSrc: string
  logoAlt: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

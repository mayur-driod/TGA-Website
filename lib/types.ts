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
  registrationUrl: string
  coverImage: string
  tags: string[]
  featured: boolean
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
}

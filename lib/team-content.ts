import type { Prisma } from "@prisma/client"
import fallbackTeamData from "@/data/team.json"
import { db } from "@/lib/db"
import type { TeamCommittee, TeamHierarchyData, TeamMemberProfile, TeamSocialLink } from "@/lib/types"

const TEAM_CONTENT_ID = "main"

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === "string" || value === null
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") {
    return null
  }

  return value as Record<string, unknown>
}

function normalizeSocial(value: unknown): TeamSocialLink | null {
  const social = asObject(value)
  if (!social) {
    return null
  }

  const platform =
    social.platform === "linkedin" ||
    social.platform === "x" ||
    social.platform === "instagram" ||
    social.platform === "email" ||
    social.platform === "website" ||
    social.platform === "other"
      ? social.platform
      : null

  if (!platform || typeof social.url !== "string" || !social.url.trim()) {
    return null
  }

  return {
    platform,
    url: social.url.trim(),
  }
}

function normalizeSocials(profile: Record<string, unknown>): TeamSocialLink[] {
  const socials: TeamSocialLink[] = []

  if (Array.isArray(profile.socials)) {
    for (const item of profile.socials) {
      const normalized = normalizeSocial(item)
      if (normalized) {
        socials.push(normalized)
      }
    }
  }

  if (typeof profile.instagram === "string" && profile.instagram.trim()) {
    socials.push({ platform: "instagram", url: profile.instagram.trim() })
  }

  if (typeof profile.email === "string" && profile.email.trim()) {
    socials.push({ platform: "email", url: profile.email.trim() })
  }

  const unique: TeamSocialLink[] = []
  for (const social of socials) {
    if (!unique.some((item) => item.platform === social.platform && item.url === social.url)) {
      unique.push(social)
    }
  }

  return unique
}

function normalizeTeamMemberProfile(value: unknown): TeamMemberProfile | null {
  const profile = asObject(value)
  if (!profile) {
    return null
  }

  if (
    typeof profile.id !== "string" ||
    typeof profile.name !== "string" ||
    typeof profile.role !== "string" ||
    typeof profile.department !== "string" ||
    !isNullableString(profile.year) ||
    typeof profile.bio !== "string" ||
    typeof profile.avatar !== "string" ||
    !isStringArray(profile.focusAreas)
  ) {
    return null
  }

  return {
    id: profile.id,
    name: profile.name,
    role: profile.role,
    department: profile.department,
    year: profile.year,
    bio: profile.bio,
    avatar: profile.avatar,
    imageUrl: isNullableString(profile.imageUrl) ? profile.imageUrl : null,
    imagePublicId: isNullableString(profile.imagePublicId) ? profile.imagePublicId : null,
    focusAreas: profile.focusAreas,
    socials: normalizeSocials(profile),
    isFounder: typeof profile.isFounder === "boolean" ? profile.isFounder : undefined,
  }
}

function normalizeTeamCommittee(value: unknown): TeamCommittee | null {
  const committee = asObject(value)
  if (!committee) {
    return null
  }

  if (
    typeof committee.id !== "string" ||
    typeof committee.name !== "string" ||
    typeof committee.description !== "string" ||
    typeof committee.focus !== "string" ||
    !isStringArray(committee.leads) ||
    !isStringArray(committee.openRoles)
  ) {
    return null
  }

  return {
    id: committee.id,
    name: committee.name,
    description: committee.description,
    focus: committee.focus,
    leads: committee.leads,
    openRoles: committee.openRoles,
  }
}

export function normalizeTeamHierarchyData(value: unknown): TeamHierarchyData | null {
  const data = asObject(value)
  if (!data) {
    return null
  }

  if (
    !Array.isArray(data.studentAdvisors) ||
    !Array.isArray(data.leadershipCore) ||
    !Array.isArray(data.committees) ||
    !Array.isArray(data.facultyMentors)
  ) {
    return null
  }

  const studentAdvisors = data.studentAdvisors.map(normalizeTeamMemberProfile)
  const leadershipCore = data.leadershipCore.map(normalizeTeamMemberProfile)
  const committees = data.committees.map(normalizeTeamCommittee)
  const facultyMentors = data.facultyMentors.map(normalizeTeamMemberProfile)

  if (
    studentAdvisors.some((item) => item === null) ||
    leadershipCore.some((item) => item === null) ||
    committees.some((item) => item === null) ||
    facultyMentors.some((item) => item === null)
  ) {
    return null
  }

  return {
    studentAdvisors: studentAdvisors as TeamMemberProfile[],
    leadershipCore: leadershipCore as TeamMemberProfile[],
    committees: committees as TeamCommittee[],
    facultyMentors: facultyMentors as TeamMemberProfile[],
  }
}

export function isTeamHierarchyData(value: unknown): value is TeamHierarchyData {
  return normalizeTeamHierarchyData(value) !== null
}

const normalizedFallbackTeamData = normalizeTeamHierarchyData(fallbackTeamData)

export const fallbackTeamHierarchyData: TeamHierarchyData = normalizedFallbackTeamData ?? {
  studentAdvisors: [],
  leadershipCore: [],
  committees: [],
  facultyMentors: [],
}

export async function getTeamHierarchyData(): Promise<TeamHierarchyData> {
  try {
    const row = await db.teamContent.findUnique({
      where: { id: TEAM_CONTENT_ID },
      select: { data: true },
    })

    if (row) {
      const normalized = normalizeTeamHierarchyData(row.data)
      if (normalized) {
        return normalized
      }
    }
  } catch {
    return fallbackTeamHierarchyData
  }

  return fallbackTeamHierarchyData
}

export async function saveTeamHierarchyData(data: TeamHierarchyData): Promise<TeamHierarchyData> {
  const normalized = normalizeTeamHierarchyData(data)
  if (!normalized) {
    throw new Error("invalid-team-data")
  }

  const jsonData = JSON.parse(JSON.stringify(normalized)) as Prisma.InputJsonValue

  const saved = await db.teamContent.upsert({
    where: { id: TEAM_CONTENT_ID },
    update: { data: jsonData },
    create: { id: TEAM_CONTENT_ID, data: jsonData },
    select: { data: true },
  })

  return normalizeTeamHierarchyData(saved.data) ?? fallbackTeamHierarchyData
}

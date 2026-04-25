export const DEFAULT_ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const

export const DEFAULT_MAX_UPLOAD_SIZE_MB = 5
export const ABSOLUTE_MAX_UPLOAD_SIZE_MB = 10

export const ALLOWED_MEDIA_FOLDERS = [
  "team",
  "hero",
  "committee",
  "events",
  "blog",
  "biodiversity",
  "profile",
] as const

export type AllowedMediaFolder = (typeof ALLOWED_MEDIA_FOLDERS)[number]

export type UploadValidationOptions = {
  allowedTypes?: readonly string[]
  maxSizeMB?: number
}

export type UploadValidationResult = {
  ok: true
} | {
  ok: false
  message: string
}

function clampMaxSizeMB(value?: number) {
  if (!value || Number.isNaN(value)) {
    return DEFAULT_MAX_UPLOAD_SIZE_MB
  }

  return Math.min(Math.max(value, 1), ABSOLUTE_MAX_UPLOAD_SIZE_MB)
}

export function getMaxUploadBytes(maxSizeMB?: number) {
  return Math.floor(clampMaxSizeMB(maxSizeMB) * 1024 * 1024)
}

export function isAllowedMimeType(type: string, allowedTypes: readonly string[] = DEFAULT_ALLOWED_IMAGE_TYPES) {
  return allowedTypes.includes(type.toLowerCase())
}

export function validateUploadFile(
  file: { size: number; type: string },
  options: UploadValidationOptions = {},
): UploadValidationResult {
  const allowedTypes = options.allowedTypes ?? DEFAULT_ALLOWED_IMAGE_TYPES
  const maxSizeMB = clampMaxSizeMB(options.maxSizeMB)
  const maxSizeBytes = getMaxUploadBytes(maxSizeMB)

  if (!isAllowedMimeType(file.type, allowedTypes)) {
    return {
      ok: false,
      message: `Unsupported file type. Please upload ${allowedTypes.join(", ")}.`,
    }
  }

  if (file.size <= 0) {
    return {
      ok: false,
      message: "The selected file is empty.",
    }
  }

  if (file.size > maxSizeBytes) {
    return {
      ok: false,
      message: `File is too large. Maximum size is ${maxSizeMB} MB.`,
    }
  }

  return { ok: true }
}

function sanitizeSegment(segment: string) {
  return segment
    .trim()
    .toLowerCase()
    .replace(/\.[a-z0-9]{2,8}$/i, "")
    .replace(/[^a-z0-9-_\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_/]+|[-_/]+$/g, "")
}

export function ensureAllowedFolder(folder: string): folder is AllowedMediaFolder {
  return ALLOWED_MEDIA_FOLDERS.includes(folder as AllowedMediaFolder)
}

export function extractRootFolder(publicId: string) {
  return publicId.split("/")[0] ?? ""
}

export function normalizePublicId(input: string, folder?: string | null) {
  const normalizedInput = input.trim().replace(/\\+/g, "/")

  if (!normalizedInput) {
    return null
  }

  const parts = normalizedInput
    .split("/")
    .map(sanitizeSegment)
    .filter(Boolean)

  if (!parts.length) {
    return null
  }

  const requestedFolder = folder ? sanitizeSegment(folder) : null

  if (requestedFolder && !ensureAllowedFolder(requestedFolder)) {
    return null
  }

  const root = requestedFolder ?? parts[0]

  if (!ensureAllowedFolder(root)) {
    return null
  }

  const finalParts = requestedFolder
    ? parts[0] === requestedFolder
      ? parts
      : [requestedFolder, ...parts]
    : parts

  if (finalParts.length < 2) {
    return null
  }

  const publicId = finalParts.join("/")

  if (publicId.length < 3 || publicId.length > 180) {
    return null
  }

  return publicId
}

export function isPublicIdInAllowedFolder(publicId: string) {
  const root = extractRootFolder(publicId)
  return ensureAllowedFolder(root)
}

export function buildTeamMemberPublicId(memberId: string, fallbackSlug: string) {
  const slug = sanitizeSegment(memberId) || sanitizeSegment(fallbackSlug) || "member"
  return `team/${slug}`
}

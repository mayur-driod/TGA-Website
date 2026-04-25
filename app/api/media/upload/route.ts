import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { uploadImageToCloudinary } from "@/lib/cloudinary"
import { Permissions } from "@/lib/permissions"
import {
  DEFAULT_ALLOWED_IMAGE_TYPES,
  DEFAULT_MAX_UPLOAD_SIZE_MB,
  isPublicIdInAllowedFolder,
  normalizePublicId,
  validateUploadFile,
} from "@/lib/upload-utils"

export const runtime = "nodejs"

type UploadSuccess = {
  success: true
  url: string
  publicId: string
}

type UploadError = {
  success: false
  error: string
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user || !Permissions.canManageTeam(session.user.role)) {
    return NextResponse.json<UploadError>({ success: false, error: "forbidden" }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const publicIdInput = formData.get("publicId")
    const folderInput = formData.get("folder")

    if (!(file instanceof File)) {
      return NextResponse.json<UploadError>({ success: false, error: "No file was provided." }, { status: 400 })
    }

    if (typeof publicIdInput !== "string") {
      return NextResponse.json<UploadError>({ success: false, error: "A publicId is required." }, { status: 400 })
    }

    const publicId = normalizePublicId(
      publicIdInput,
      typeof folderInput === "string" && folderInput.trim() ? folderInput : null,
    )

    if (!publicId || !isPublicIdInAllowedFolder(publicId)) {
      return NextResponse.json<UploadError>(
        { success: false, error: "Invalid publicId or folder." },
        { status: 400 },
      )
    }

    const validation = validateUploadFile(file, {
      maxSizeMB: DEFAULT_MAX_UPLOAD_SIZE_MB,
      allowedTypes: DEFAULT_ALLOWED_IMAGE_TYPES,
    })

    if (!validation.ok) {
      return NextResponse.json<UploadError>({ success: false, error: validation.message }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await uploadImageToCloudinary({
      buffer,
      publicId,
    })

    return NextResponse.json<UploadSuccess>({
      success: true,
      url: result.url,
      publicId: result.publicId,
    })
  } catch {
    return NextResponse.json<UploadError>(
      { success: false, error: "Could not upload image. Please try again." },
      { status: 500 },
    )
  }
}

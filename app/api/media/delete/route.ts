import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { deleteImageFromCloudinary } from "@/lib/cloudinary"
import { Permissions } from "@/lib/permissions"
import { isPublicIdInAllowedFolder, normalizePublicId } from "@/lib/upload-utils"

export const runtime = "nodejs"

type DeleteBody = {
  publicId?: string
}

type DeleteSuccess = {
  success: true
  publicId: string
  deleted: boolean
}

type DeleteError = {
  success: false
  error: string
}

async function handleDelete(request: Request) {
  const session = await auth()

  if (!session?.user || !Permissions.canManageTeam(session.user.role)) {
    return NextResponse.json<DeleteError>({ success: false, error: "forbidden" }, { status: 403 })
  }

  try {
    const body = (await request.json()) as DeleteBody

    if (!body.publicId || typeof body.publicId !== "string") {
      return NextResponse.json<DeleteError>({ success: false, error: "publicId is required" }, { status: 400 })
    }

    const publicId = normalizePublicId(body.publicId)

    if (!publicId || !isPublicIdInAllowedFolder(publicId)) {
      return NextResponse.json<DeleteError>(
        { success: false, error: "Invalid or unauthorized publicId" },
        { status: 400 },
      )
    }

    const result = await deleteImageFromCloudinary(publicId)

    return NextResponse.json<DeleteSuccess>({
      success: true,
      publicId,
      deleted: result.result === "ok",
    })
  } catch {
    return NextResponse.json<DeleteError>({ success: false, error: "Could not delete image." }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  return handleDelete(request)
}

export async function POST(request: Request) {
  return handleDelete(request)
}

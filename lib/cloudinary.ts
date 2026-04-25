import "server-only"

import { v2 as cloudinary } from "cloudinary"

type UploadToCloudinaryInput = {
  buffer: Buffer
  publicId: string
}

type UploadToCloudinaryResult = {
  url: string
  publicId: string
}

let cloudinaryConfigured = false

function getRequiredEnv(name: "CLOUDINARY_CLOUD_NAME" | "CLOUDINARY_API_KEY" | "CLOUDINARY_API_SECRET") {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function ensureCloudinaryConfigured() {
  if (cloudinaryConfigured) {
    return
  }

  cloudinary.config({
    cloud_name: getRequiredEnv("CLOUDINARY_CLOUD_NAME"),
    api_key: getRequiredEnv("CLOUDINARY_API_KEY"),
    api_secret: getRequiredEnv("CLOUDINARY_API_SECRET"),
    secure: true,
  })

  cloudinaryConfigured = true
}

export async function uploadImageToCloudinary(input: UploadToCloudinaryInput): Promise<UploadToCloudinaryResult> {
  ensureCloudinaryConfigured()

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        public_id: input.publicId,
        overwrite: true,
        invalidate: true,
        unique_filename: false,
        use_filename: false,
      },
      (error, result) => {
        if (error || !result?.secure_url || !result.public_id) {
          reject(error ?? new Error("Cloudinary upload failed"))
          return
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        })
      },
    )

    stream.end(input.buffer)
  })
}

export async function deleteImageFromCloudinary(publicId: string) {
  ensureCloudinaryConfigured()

  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  })
}

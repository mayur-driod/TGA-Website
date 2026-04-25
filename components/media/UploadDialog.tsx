"use client"

import { useEffect, useRef, useState } from "react"
import { ImagePlus, Loader2, UploadCloud } from "lucide-react"

import ImageCropper from "@/components/media/ImageCropper"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DEFAULT_ALLOWED_IMAGE_TYPES,
  DEFAULT_MAX_UPLOAD_SIZE_MB,
  type UploadValidationResult,
  validateUploadFile,
} from "@/lib/upload-utils"

type UploadSuccessPayload = {
  url: string
  publicId: string
}

type UploadDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  publicId: string
  folder?: string
  aspect?: number
  maxSizeMB?: number
  allowedTypes?: readonly string[]
  initialFile?: File | null
  initialImageUrl?: string | null
  onSuccess: (payload: UploadSuccessPayload) => void
  onError?: (message: string) => void
}

function uploadWithProgress({
  file,
  publicId,
  folder,
  onProgress,
}: {
  file: File
  publicId: string
  folder?: string
  onProgress: (percent: number) => void
}) {
  return new Promise<UploadSuccessPayload>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()

    formData.append("file", file)
    formData.append("publicId", publicId)

    if (folder) {
      formData.append("folder", folder)
    }

    xhr.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) {
        return
      }

      const percent = Math.round((event.loaded / event.total) * 100)
      onProgress(percent)
    })

    xhr.addEventListener("load", () => {
      try {
        const response = JSON.parse(xhr.responseText) as {
          success?: boolean
          error?: string
          url?: string
          publicId?: string
        }

        if (xhr.status >= 200 && xhr.status < 300 && response.success && response.url && response.publicId) {
          resolve({ url: response.url, publicId: response.publicId })
          return
        }

        reject(new Error(response.error ?? "Upload failed"))
      } catch {
        reject(new Error("Upload failed. Please try again."))
      }
    })

    xhr.addEventListener("error", () => {
      reject(new Error("Network issue while uploading. Please retry."))
    })

    xhr.open("POST", "/api/media/upload")
    xhr.send(formData)
  })
}

export default function UploadDialog({
  open,
  onOpenChange,
  title,
  description,
  publicId,
  folder,
  aspect = 1,
  maxSizeMB = DEFAULT_MAX_UPLOAD_SIZE_MB,
  allowedTypes = DEFAULT_ALLOWED_IMAGE_TYPES,
  initialFile,
  initialImageUrl,
  onSuccess,
  onError,
}: UploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const clearObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }

  useEffect(() => {
    if (!open) {
      clearObjectUrl()
      setSourceImage(null)
      return
    }

    setError(null)
    setProgress(0)

    if (initialFile) {
      clearObjectUrl()
      const objectUrl = URL.createObjectURL(initialFile)
      objectUrlRef.current = objectUrl
      setSourceImage(objectUrl)
      return
    }

    if (initialImageUrl) {
      clearObjectUrl()
      setSourceImage(initialImageUrl)
      return
    }

    clearObjectUrl()
    setSourceImage(null)
  }, [initialFile, initialImageUrl, open])

  useEffect(() => {
    return () => {
      clearObjectUrl()
    }
  }, [])

  const processFile = (file: File) => {
    const validation: UploadValidationResult = validateUploadFile(file, {
      allowedTypes,
      maxSizeMB,
    })

    if (!validation.ok) {
      setError(validation.message)
      return
    }

    clearObjectUrl()
    const objectUrl = URL.createObjectURL(file)
    objectUrlRef.current = objectUrl
    setSourceImage(objectUrl)
    setError(null)
  }

  const handleApplyCrop = async (blob: Blob) => {
    setIsUploading(true)
    setProgress(0)

    try {
      const uploadFile = new File([blob], "cropped-image.webp", { type: blob.type || "image/webp" })
      const result = await uploadWithProgress({
        file: uploadFile,
        publicId,
        folder,
        onProgress: setProgress,
      })

      onSuccess(result)
      onOpenChange(false)
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Upload failed"
      setError(message)
      onError?.(message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-1rem)] overflow-y-auto p-0 sm:w-full sm:max-w-2xl" showCloseButton={false}>
        <DialogHeader className="border-b px-4 py-3 sm:pr-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description ?? "Upload and crop image before publishing."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-4 pb-4 pt-3">
          {!sourceImage ? (
            <div
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault()
                setIsDragging(false)
                const file = event.dataTransfer.files?.[0]
                if (file) {
                  processFile(file)
                }
              }}
              className={`rounded-xl border border-dashed p-4 text-center transition-colors sm:p-6 ${
                isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/20"
              }`}
            >
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background">
                <UploadCloud className="size-5 text-primary" aria-hidden />
              </div>
              <p className="text-sm font-medium text-foreground">Drag and drop your image</p>
              <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP up to {maxSizeMB} MB</p>

              <Button type="button" variant="outline" className="mt-3" onClick={() => fileInputRef.current?.click()}>
                <ImagePlus className="size-4" aria-hidden />
                Choose image
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept={allowedTypes.join(",")}
                className="hidden"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0]
                  if (selectedFile) {
                    processFile(selectedFile)
                  }
                }}
              />
            </div>
          ) : (
            <ImageCropper
              imageSrc={sourceImage}
              aspect={aspect}
              onCancel={() => {
                clearObjectUrl()
                setSourceImage(null)
                setError(null)
              }}
              onApply={handleApplyCrop}
              isApplying={isUploading}
            />
          )}

          {isUploading ? (
            <div className="space-y-1.5 rounded-lg border border-border bg-muted/20 p-2.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Loader2 className="size-3 animate-spin" aria-hidden /> Uploading
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-border/70">
                <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : null}

          {error ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-2 text-xs text-destructive">{error}</p>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t bg-muted/50 px-4 py-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

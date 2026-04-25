"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { Crop, ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react"

import UploadDialog from "@/components/media/UploadDialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DEFAULT_ALLOWED_IMAGE_TYPES,
  DEFAULT_MAX_UPLOAD_SIZE_MB,
  normalizePublicId,
} from "@/lib/upload-utils"

type UploadPayload = {
  url: string
  publicId: string
}

type ImageUploadCardProps = {
  title: string
  description?: string
  publicId: string
  currentImage?: string | null
  folder?: string
  aspect?: number
  maxSizeMB?: number
  allowedTypes?: readonly string[]
  size?: "default" | "compact"
  onSuccess?: (payload: UploadPayload) => void
  onDelete?: () => void
}

type BannerState = {
  type: "success" | "error"
  message: string
} | null

async function deleteByPublicId(publicId: string) {
  const response = await fetch("/api/media/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicId }),
  })

  const payload = (await response.json()) as { success?: boolean; error?: string }

  if (!response.ok || !payload.success) {
    throw new Error(payload.error ?? "Delete failed")
  }
}

export default function ImageUploadCard({
  title,
  description,
  publicId,
  currentImage,
  folder,
  aspect = 1,
  maxSizeMB = DEFAULT_MAX_UPLOAD_SIZE_MB,
  allowedTypes = DEFAULT_ALLOWED_IMAGE_TYPES,
  size = "default",
  onSuccess,
  onDelete,
}: ImageUploadCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(currentImage ?? null)
  const [banner, setBanner] = useState<BannerState>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [initialImageUrl, setInitialImageUrl] = useState<string | null>(null)
  const [initialFile, setInitialFile] = useState<File | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  useEffect(() => {
    setImageUrl(currentImage ?? null)
  }, [currentImage])

  useEffect(() => {
    if (!banner) {
      return
    }

    const timer = window.setTimeout(() => {
      setBanner(null)
    }, 4200)

    return () => {
      window.clearTimeout(timer)
    }
  }, [banner])

  const normalizedPublicId = useMemo(() => normalizePublicId(publicId, folder ?? null), [folder, publicId])
  const isCompact = size === "compact"

  const openUploadDialog = ({
    seededImage,
    seededFile,
  }: {
    seededImage?: string | null
    seededFile?: File | null
  } = {}) => {
    if (!normalizedPublicId) {
      setBanner({ type: "error", message: "Invalid public ID. Please update it before uploading." })
      return
    }

    setInitialImageUrl(seededImage ?? null)
    setInitialFile(seededFile ?? null)
    setDialogOpen(true)
  }

  const runDelete = async () => {
    if (!normalizedPublicId) {
      setBanner({ type: "error", message: "Invalid media id. Update the member ID and retry." })
      return
    }

    setIsDeleting(true)

    try {
      await deleteByPublicId(normalizedPublicId)
      setImageUrl(null)
      setBanner({ type: "success", message: "Image deleted from Cloudinary." })
      onDelete?.()
      setDeleteDialogOpen(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed"
      setBanner({ type: "error", message })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className={`border border-border/80 bg-card/95 shadow-sm ${isCompact ? "max-w-md" : ""}`}>
        <CardHeader className={`border-b border-border/60 ${isCompact ? "pb-2.5" : "pb-3"}`}>
          <CardTitle className="text-sm text-foreground">{title}</CardTitle>
          <CardDescription className="text-xs">{description ?? "Upload and manage an image."}</CardDescription>
        </CardHeader>

        <CardContent className={`space-y-3 ${isCompact ? "pt-2.5" : "pt-3"}`}>
          {banner ? (
            <p
              className={`rounded-md px-2.5 py-2 text-xs ${
                banner.type === "success"
                  ? "border border-primary/30 bg-primary/10 text-primary"
                  : "border border-destructive/30 bg-destructive/10 text-destructive"
              }`}
            >
              {banner.message}
            </p>
          ) : null}

          {imageUrl ? (
            <div className="group/upload relative overflow-hidden rounded-xl border border-border bg-muted/20">
              <div className={`relative ${isCompact ? "aspect-4/3" : "aspect-square"}`}>
                <Image
                  src={imageUrl}
                  alt={`${title} preview`}
                  fill
                  sizes={isCompact ? "(max-width: 768px) 100vw, 320px" : "(max-width: 768px) 100vw, 360px"}
                  className="object-cover transition-transform duration-500 group-hover/upload:scale-[1.02]"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-75" />
                <div className={`absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 opacity-0 transition-opacity duration-300 group-hover/upload:opacity-100 group-focus-within/upload:opacity-100 ${isCompact ? "p-2" : "p-2.5"}`}>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => openUploadDialog()}
                    className="bg-background/95"
                  >
                    <UploadCloud className="size-3.5" aria-hidden />
                    Replace image
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => openUploadDialog({ seededImage: imageUrl })}
                    className="border-white/60 bg-white/15 text-white hover:bg-white/25"
                  >
                    <Crop className="size-3.5" aria-hidden />
                    Edit / Re-crop
                  </Button>
                  <Button className="bg-red-600 text-white hover:bg-red-700" type="button" size="sm" variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                    <Trash2 className="size-3.5" aria-hidden />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between px-2.5 py-2 text-[11px] text-muted-foreground">
                <span className="truncate">{normalizedPublicId ?? publicId}</span>
                <span>Overwrite enabled</span>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragActive(true)
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={(event) => {
                event.preventDefault()
                setIsDragActive(false)
                const droppedFile = event.dataTransfer.files?.[0]
                if (droppedFile) {
                  openUploadDialog({ seededFile: droppedFile })
                }
              }}
              className={`space-y-3 rounded-xl border border-dashed p-3 transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-border bg-muted/20"
              }`}
            >
              <div className="rounded-lg border border-border bg-background/80 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Image guidelines</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs text-muted-foreground">
                  <li>Keep the face centered and clearly visible.</li>
                  <li>Use clean lighting and avoid busy backgrounds.</li>
                  <li>Square or near-square framing works best.</li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-background/90 p-3 text-center">
                <p className="text-sm font-medium text-foreground">Drop image here or start upload</p>
                <p className="mt-1 text-xs text-muted-foreground">Supports JPG, PNG, WEBP up to {maxSizeMB} MB.</p>
                <Button type="button" variant="outline" className="mt-3" onClick={() => openUploadDialog()}>
                  <ImagePlus className="size-4" aria-hidden />
                  Click to upload
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-between text-xs text-muted-foreground">
          <span>Public ID</span>
          <span className="truncate">{normalizedPublicId ?? "Invalid public id"}</span>
        </CardFooter>
      </Card>

      <UploadDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={title}
        description={description}
        publicId={normalizedPublicId ?? publicId}
        folder={folder}
        aspect={aspect}
        maxSizeMB={maxSizeMB}
        allowedTypes={allowedTypes}
        initialImageUrl={initialImageUrl}
        initialFile={initialFile}
        onSuccess={(payload) => {
          setImageUrl(payload.url)
          setBanner({ type: "success", message: "Image uploaded successfully." })
          onSuccess?.(payload)
        }}
        onError={(message) => setBanner({ type: "error", message })}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete image?</DialogTitle>
            <DialogDescription>
              This removes the image asset from Cloudinary and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={runDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-3.5" aria-hidden />
                  Delete image
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

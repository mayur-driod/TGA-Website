"use client"

import { useCallback, useState } from "react"
import Cropper, { type Area } from "react-easy-crop"

import { Button } from "@/components/ui/button"

type ImageCropperProps = {
  imageSrc: string
  aspect?: number
  onCancel: () => void
  onApply: (blob: Blob) => Promise<void> | void
  isApplying?: boolean
}

function createImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Could not load image for cropping"))
    image.src = src
  })
}

async function getCroppedImageBlob(imageSrc: string, cropArea: Area) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  canvas.width = cropArea.width
  canvas.height = cropArea.height

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Canvas context is unavailable")
  }

  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height,
  )

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not create cropped image blob"))
          return
        }

        resolve(blob)
      },
      "image/webp",
      0.95,
    )
  })
}

export default function ImageCropper({ imageSrc, aspect = 1, onCancel, onApply, isApplying = false }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [cropAreaPixels, setCropAreaPixels] = useState<Area | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCropComplete = useCallback((_croppedArea: Area, croppedAreaPixelsValue: Area) => {
    setCropAreaPixels(croppedAreaPixelsValue)
  }, [])

  const handleApply = async () => {
    if (!cropAreaPixels) {
      setError("Move or zoom the image before applying the crop.")
      return
    }

    setError(null)

    try {
      const blob = await getCroppedImageBlob(imageSrc, cropAreaPixels)
      await onApply(blob)
    } catch {
      setError("Could not crop this image. Please try another file.")
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative h-72 overflow-hidden rounded-xl border border-border bg-muted/30 md:h-80">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          showGrid
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </div>

      <div className="space-y-1.5 rounded-lg border border-border bg-muted/25 p-2.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Zoom</span>
          <span>{zoom.toFixed(2)}x</span>
        </div>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
          className="w-full accent-primary"
          aria-label="Zoom image"
        />
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-2 text-xs text-destructive">{error}</p>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isApplying}>
          Cancel
        </Button>
        <Button type="button" onClick={handleApply} disabled={isApplying}>
          {isApplying ? "Uploading..." : "Apply crop"}
        </Button>
      </div>
    </div>
  )
}

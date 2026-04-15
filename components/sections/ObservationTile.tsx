"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

type ObservationTileProps = {
  speciesName: string
  observedDate: string
  reporterName: string
  imageUrl: string | null
}

export default function ObservationTile({
  speciesName,
  observedDate,
  reporterName,
  imageUrl,
}: ObservationTileProps) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <Link
      href="/biodiversity"
      className="group relative block aspect-square overflow-hidden rounded-lg bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:ring-offset-2"
    >
      {imageUrl && !imageFailed ? (
        <Image
          src={imageUrl}
          alt={speciesName}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-forest-100/40 px-3 text-center">
          <p className="text-xs font-semibold text-foreground">Observation available</p>
          <p className="mt-1 text-[10px] text-muted-foreground">Image unavailable</p>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-1.5 text-white sm:p-2">
        <p className="line-clamp-1 text-[10px] font-medium sm:text-[11px]">{speciesName}</p>
        <p className="text-[9px] text-white/85 sm:text-[10px]">{observedDate}</p>
        <p className="line-clamp-1 text-[9px] text-white/75 sm:text-[10px]">{reporterName}</p>
      </div>
    </Link>
  )
}

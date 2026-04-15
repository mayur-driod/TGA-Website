"use client"

import { useEffect, useRef, useState } from "react"

export default function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement | HTMLSpanElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref.current || isVisible) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [isVisible, threshold])

  return { ref, isVisible }
}

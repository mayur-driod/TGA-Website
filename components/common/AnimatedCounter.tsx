"use client"

import { useEffect, useMemo, useState } from "react"
import useScrollAnimation from "@/hooks/useScrollAnimation"

type AnimatedCounterProps = {
  value: number
  suffix?: string
  duration?: number
}

export default function AnimatedCounter({
  value,
  suffix = "",
  duration = 1500,
}: AnimatedCounterProps) {
  const { ref, isVisible } = useScrollAnimation()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let frame = 0
    const start = performance.now()
    const easeOut = (t: number) => 1 - (1 - t) ** 3

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1)
      setCount(Math.round(value * easeOut(progress)))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [duration, isVisible, value])

  const label = useMemo(() => `${count}${suffix}`, [count, suffix])

  return <span ref={ref}>{label}</span>
}

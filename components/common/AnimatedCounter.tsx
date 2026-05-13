"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import useScrollAnimation from "@/hooks/useScrollAnimation"
import { SPLASH_DONE_EVENT } from "@/lib/constants"

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
  const [isSplashDone, setIsSplashDone] = useState(() =>
    typeof window !== "undefined"
      ? (window as Window & { __tgaSplashDone?: boolean }).__tgaSplashDone === true
      : false
  )
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    const handleSplashDone = () => setIsSplashDone(true)

    window.addEventListener(SPLASH_DONE_EVENT, handleSplashDone)

    return () => {
      window.removeEventListener(SPLASH_DONE_EVENT, handleSplashDone)
    }
  }, [])

  useEffect(() => {
    if (!isVisible || !isSplashDone || hasAnimatedRef.current) return

    let frame = 0
    let delayTimer = 0
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t))

    const startAnimation = () => {
      const start = performance.now()
      hasAnimatedRef.current = true

      const tick = (time: number) => {
        const progress = Math.min((time - start) / duration, 1)
        setCount(Math.round(value * easeOutExpo(progress)))
        if (progress < 1) {
          frame = requestAnimationFrame(tick)
        }
      }

      frame = requestAnimationFrame(tick)
    }

    delayTimer = window.setTimeout(startAnimation, 180)
    return () => {
      window.clearTimeout(delayTimer)
      cancelAnimationFrame(frame)
    }
  }, [duration, isSplashDone, isVisible, value])

  const label = useMemo(() => `${count}${suffix}`, [count, suffix])

  return <span ref={ref}>{label}</span>
}

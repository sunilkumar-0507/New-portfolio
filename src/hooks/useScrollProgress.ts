import { useEffect, useRef } from 'react'
import { scroll } from '../lib/store'

/**
 * Calls `onProgress` every animation frame with the page scroll progress (0..1)
 * without triggering React renders. The shared `scroll` store is kept in sync by
 * the Lenis integration in `animations/gsapAnimations.ts`.
 */
export function useScrollProgress(onProgress: (progress: number, velocity: number) => void) {
  const cb = useRef(onProgress)
  cb.current = onProgress

  useEffect(() => {
    let raf = 0
    let last = -1
    const tick = () => {
      if (scroll.progress !== last) {
        last = scroll.progress
        cb.current(scroll.progress, scroll.velocity)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
}

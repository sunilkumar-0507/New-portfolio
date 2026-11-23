import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
export const useCoarsePointer = () => useMediaQuery('(pointer: coarse)')

/** Non-hook helpers for code that runs outside React (GSAP setup, scene init). */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const isMobileViewport = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
export const isCoarsePointer = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

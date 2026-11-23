export type Tier = 'high' | 'medium' | 'low'

/** Initial rendering tier from device hints. PerformanceMonitor refines it at runtime. */
export function detectTier(): Tier {
  if (typeof window === 'undefined') return 'medium'
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const narrow = window.innerWidth < 768
  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  if (narrow || cores <= 4 || memory <= 4) return 'low'
  if (coarse) return 'medium'
  return 'high'
}

export const tierConfig = {
  high: { particles: 2200, shards: 80, orbDetail: 56, dpr: [1, 1.75] as [number, number], shadows: true, post: true },
  medium: { particles: 1300, shards: 46, orbDetail: 36, dpr: [1, 1.5] as [number, number], shadows: false, post: true },
  low: { particles: 650, shards: 22, orbDetail: 22, dpr: [1, 1.25] as [number, number], shadows: false, post: false },
} as const

export const downgrade = (t: Tier): Tier => (t === 'high' ? 'medium' : 'low')
export const upgrade = (t: Tier): Tier => (t === 'low' ? 'medium' : 'high')

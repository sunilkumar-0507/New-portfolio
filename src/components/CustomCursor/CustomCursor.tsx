import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../animations/gsapAnimations'
import { useCoarsePointer, useReducedMotion } from '../../hooks/useMediaQuery'

const INTERACTIVE = 'a, button, [data-cursor], [role="button"], input, label'

/**
 * Two-part cursor: a precise red dot and a lagging ring that swells and shows a
 * label over interactive elements. Disabled for touch and reduced motion.
 */
export default function CustomCursor() {
  const coarse = useCoarsePointer()
  const reduced = useReducedMotion()
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const enabled = !coarse && !reduced

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return
    document.documentElement.classList.add('has-custom-cursor')
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3.out' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3.out' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3.out' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3.out' })
    let hovering: Element | null = null

    const move = (e: PointerEvent) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE) ?? null
      if (el === hovering) return
      hovering = el
      const text = el?.getAttribute('data-cursor') ?? ''
      setLabel(text)
      gsap.to(ring.current, {
        scale: el ? (text ? 2.6 : 1.7) : 1,
        backgroundColor: el ? (text ? 'rgba(139,63,217,0.92)' : 'rgba(255,255,255,0.06)') : 'rgba(255,255,255,0)',
        borderColor: el && text ? 'rgba(139,63,217,0)' : 'rgba(255,255,255,0.45)',
        duration: 0.45,
        ease: 'power3.out',
      })
      gsap.to(dot.current, { scale: el ? 0 : 1, duration: 0.3 })
    }
    const down = () => gsap.to(ring.current, { scale: '*=0.8', duration: 0.2 })
    const up = () => gsap.to(ring.current, { scale: hovering ? (label ? 2.6 : 1.7) : 1, duration: 0.4 })
    const hide = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 })
    const show = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 })

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.documentElement.addEventListener('pointerleave', hide)
    document.documentElement.addEventListener('pointerenter', show)
    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.documentElement.removeEventListener('pointerleave', hide)
      document.documentElement.removeEventListener('pointerenter', show)
    }
    // label is read only for the pointerup scale; avoid re-binding on every change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  if (!enabled) return null
  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden="true">
      <div
        ref={ring}
        className="absolute left-0 top-0 -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/45"
      >
        <span className="font-grotesk text-[5px] font-bold uppercase tracking-[0.18em] text-white">{label}</span>
      </div>
      <div ref={dot} className="absolute left-0 top-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-accent" />
    </div>
  )
}

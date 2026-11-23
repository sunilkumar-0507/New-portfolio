import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '../../animations/gsapAnimations'
import { isCoarsePointer, prefersReducedMotion } from '../../hooks/useMediaQuery'

type Variant = 'primary' | 'ghost' | 'plain'

type Props = {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: Variant
  className?: string
  strength?: number
  external?: boolean
  cursor?: string
  ariaLabel?: string
}

const styles: Record<Variant, string> = {
  primary:
    'group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-accent px-7 py-4 font-grotesk text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_0_40px_-8px_rgba(255,21,56,0.7)]',
  ghost:
    'group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/25 px-7 py-4 font-grotesk text-sm font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm',
  plain: 'group/btn relative inline-flex items-center',
}

/**
 * Button / link that is magnetically attracted to the cursor. The label moves
 * further than the shell for a layered, dimensional feel. A fill sweeps in on
 * hover. Falls back to a normal button on touch / reduced motion.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  strength = 0.4,
  external,
  cursor,
  ariaLabel,
}: Props) {
  const root = useRef<HTMLElement | null>(null)
  const inner = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = root.current
    const lab = inner.current
    if (!el || !lab || isCoarsePointer() || prefersReducedMotion()) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    const lxTo = gsap.quickTo(lab, 'x', { duration: 0.6, ease: 'power3.out' })
    const lyTo = gsap.quickTo(lab, 'y', { duration: 0.6, ease: 'power3.out' })

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      xTo(dx * strength)
      yTo(dy * strength)
      lxTo(dx * strength * 0.45)
      lyTo(dy * strength * 0.45)
    }
    const leave = () => {
      gsap.to([el, lab], { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.35)' })
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])

  const content = (
    <>
      {variant !== 'plain' && (
        <span
          aria-hidden
          className={`absolute inset-0 -z-0 translate-y-[101%] rounded-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:translate-y-0 ${
            variant === 'primary' ? 'bg-white' : 'bg-accent'
          }`}
        />
      )}
      <span
        ref={inner}
        className={`relative z-10 inline-flex items-center gap-3 ${
          variant === 'primary' ? 'transition-colors duration-500 group-hover/btn:text-black' : ''
        }`}
      >
        {children}
      </span>
    </>
  )

  const cls = `${styles[variant]} ${className}`
  if (href) {
    return (
      <a
        ref={(el) => void (root.current = el)}
        href={href}
        className={cls}
        data-cursor={cursor}
        aria-label={ariaLabel}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }
  return (
    <button
      ref={(el) => void (root.current = el)}
      type="button"
      className={cls}
      onClick={onClick}
      data-cursor={cursor}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  )
}

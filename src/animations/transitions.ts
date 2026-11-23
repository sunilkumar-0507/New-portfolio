import type { Transition, Variants } from 'framer-motion'

export const easeExpo = [0.16, 1, 0.3, 1] as const
export const easeInOut = [0.76, 0, 0.24, 1] as const

export const springSoft: Transition = { type: 'spring', stiffness: 160, damping: 22, mass: 0.6 }

/** Fullscreen mobile menu: red curtain wipes in from the top, then content. */
export const menuOverlay: Variants = {
  closed: { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.7, ease: easeInOut, when: 'afterChildren' } },
  open: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.8, ease: easeInOut, when: 'beforeChildren', staggerChildren: 0.07 } },
}

export const menuItem: Variants = {
  closed: { y: '110%', rotate: 4, opacity: 0, transition: { duration: 0.35, ease: easeInOut } },
  open: { y: '0%', rotate: 0, opacity: 1, transition: { duration: 0.9, ease: easeExpo } },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 1, ease: easeExpo, delay: i * 0.08 } }),
}

export const servicePanel: Variants = {
  initial: { opacity: 0, scale: 0.92, rotateX: -18, y: 30 },
  animate: { opacity: 1, scale: 1, rotateX: 0, y: 0, transition: { duration: 0.6, ease: easeExpo } },
  exit: { opacity: 0, scale: 1.05, rotateX: 14, y: -24, transition: { duration: 0.3, ease: easeInOut } },
}

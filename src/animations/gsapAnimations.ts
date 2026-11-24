import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import { scroll } from '../lib/store'
import { prefersReducedMotion } from '../hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
gsap.defaults({ ease: 'expo.out', duration: 1.2 })
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, SplitText, useGSAP }

/* ------------------------------------------------------- smooth scrolling */

let lenis: Lenis | null = null

function syncNative() {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  const y = window.scrollY
  scroll.velocity = y - scroll.y
  scroll.y = y
  scroll.progress = Math.min(1, Math.max(0, y / max))
}

/** Boots Lenis (or native scroll when reduced motion is requested) and wires it into GSAP. */
export function initSmoothScroll() {
  if (prefersReducedMotion()) {
    window.addEventListener('scroll', syncNative, { passive: true })
    syncNative()
    return () => window.removeEventListener('scroll', syncNative)
  }

  const instance = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95, syncTouch: false })
  lenis = instance
  instance.on('scroll', (l: Lenis) => {
    scroll.y = l.scroll
    scroll.progress = l.progress || 0
    scroll.velocity = l.velocity
    ScrollTrigger.update()
  })
  const raf = (time: number) => instance.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(raf)
    gsap.ticker.lagSmoothing(500, 33)
    instance.destroy()
    lenis = null
  }
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

export function scrollToSection(id: string) {
  const target = id === 'home' ? 0 : document.getElementById(id)
  if (target === null) return
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4), force: true })
    return
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

/* ------------------------------------------------------------ text helpers */

/**
 * Masked line reveal: each line slides up from behind a mask with a slight
 * 3D tilt. Re-splits automatically on resize / font load.
 */
export function revealLines(target: Element | string, opts: { trigger?: Element; delay?: number; start?: string; scrub?: boolean } = {}) {
  return SplitText.create(target, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 115,
        rotate: 3,
        transformOrigin: '0% 100%',
        duration: 1.3,
        stagger: 0.09,
        delay: opts.delay ?? 0,
        scrollTrigger: {
          trigger: opts.trigger ?? (typeof target === 'string' ? undefined : target),
          start: opts.start ?? 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
    },
  })
}

/**
 * Scrubbed word-by-word "ink" effect: words light up from muted to white as
 * the paragraph travels through the viewport.
 */
export function inkWords(target: Element) {
  return SplitText.create(target, {
    type: 'words',
    autoSplit: true,
    onSplit(self) {
      return gsap.fromTo(
        self.words,
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.08,
          scrollTrigger: { trigger: target, start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )
    },
  })
}

/**
 * `background-clip: text` gradients break once SplitText wraps each character
 * in its own (masked, transformed) element. Re-paint every split char inside a
 * `.text-brand` host with the host's gradient, offset so the sweep stays continuous.
 */
export function paintBrandChars(chars: Element[]) {
  const hosts = new Map<HTMLElement, HTMLElement[]>()
  for (const c of chars) {
    const host = (c as HTMLElement).closest<HTMLElement>('.text-brand')
    if (!host) continue
    if (!hosts.has(host)) hosts.set(host, [])
    hosts.get(host)!.push(c as HTMLElement)
  }
  hosts.forEach((list, host) => {
    const hr = host.getBoundingClientRect()
    const image = getComputedStyle(host).backgroundImage
    for (const ch of list) {
      const r = ch.getBoundingClientRect()
      ch.style.backgroundImage = image
      ch.style.backgroundSize = `${hr.width}px ${hr.height}px`
      ch.style.backgroundPosition = `${hr.left - r.left}px 0`
      ch.style.backgroundRepeat = 'no-repeat'
      ch.style.setProperty('-webkit-background-clip', 'text')
      ch.style.backgroundClip = 'text'
      ch.style.color = 'transparent'
    }
  })
}

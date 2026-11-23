import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../animations/gsapAnimations'
import { app } from '../../lib/store'
import { prefersReducedMotion } from '../../hooks/useMediaQuery'
import { LOGO_PATHS, LOGO_VIEWBOX } from './logoPaths'

const MIN_TIME = 2.3 // seconds before the logo may hand over
const MAX_WAIT = 7 // never block longer than this, even if WebGL is slow

type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; hue: number }

/**
 * Cinematic intro:
 *   1. black screen → 2. red particles fade in → 3. they spiral into the centre
 *   → 4. the K76 outline draws and fills → 5. logo scales through the camera
 *   → 6. hands over to the 3D hero (which bursts particles back out).
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const logo = useRef<SVGSVGElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    const cvs = canvas.current!
    const ctx = cvs.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      cvs.width = w * dpr
      cvs.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const N = w < 768 ? 140 : 320
    const ps: P[] = Array.from({ length: N }, () => {
      const a = Math.random() * Math.PI * 2
      const d = Math.max(w, h) * (0.25 + Math.random() * 0.6)
      return {
        x: w / 2 + Math.cos(a) * d,
        y: h / 2 + Math.sin(a) * d,
        vx: 0,
        vy: 0,
        r: 0.6 + Math.random() * 2.2,
        a: 0,
        hue: Math.random(),
      }
    })

    const state = { converge: 0, fade: 0, flash: 0 }
    let raf = 0
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h / 2
      for (const p of ps) {
        const dx = cx - p.x
        const dy = cy - p.y
        const d = Math.hypot(dx, dy) || 1
        // spiral inward: radial pull + tangential swirl, both scaled by `converge`
        const pull = 0.0009 * state.converge * d + 0.05 * state.converge
        p.vx += (dx / d) * pull - (dy / d) * 0.35 * state.converge
        p.vy += (dy / d) * pull + (dx / d) * 0.35 * state.converge
        p.vx *= 0.9
        p.vy *= 0.9
        p.x += p.vx + Math.sin(performance.now() * 0.001 + p.hue * 10) * 0.15
        p.y += p.vy
        p.a += (state.fade - p.a) * 0.05
        const near = Math.max(0, 1 - d / 140)
        ctx.beginPath()
        ctx.fillStyle = p.hue > 0.8 ? `rgba(255,255,255,${p.a * 0.8})` : `rgba(255,${21 + near * 60},56,${p.a})`
        ctx.arc(p.x, p.y, p.r * (1 - near * 0.5), 0, Math.PI * 2)
        ctx.fill()
      }
      if (state.flash > 0) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 260)
        g.addColorStop(0, `rgba(255,21,56,${0.55 * state.flash})`)
        g.addColorStop(1, 'rgba(255,21,56,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    const paths = Array.from(logo.current!.querySelectorAll('path'))
    paths.forEach((p) => {
      const len = p.getTotalLength()
      p.style.strokeDasharray = `${len}`
      p.style.strokeDashoffset = `${len}`
    })

    const start = performance.now()
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      const out = gsap.timeline({
        onComplete: () => {
          setGone(true)
          onDone()
        },
      })
      // Kick the 3D intro off as the logo flies through the camera.
      out.add(() => app.setPhase('intro'), reduced ? 0 : 0.35)
      if (reduced) {
        out.to(root.current, { opacity: 0, duration: 0.4 })
        return
      }
      out
        .to(counter.current, { opacity: 0, duration: 0.3 }, 0)
        .to(logo.current, { scale: 14, opacity: 0, duration: 1.1, ease: 'expo.in' }, 0)
        .to(state, { flash: 1, duration: 0.5, ease: 'power2.in' }, 0.3)
        .to(root.current, { clipPath: 'circle(0% at 50% 50%)', duration: 1.0, ease: 'expo.inOut' }, 0.55)
    }

    const tl = gsap.timeline()
    if (reduced) {
      tl.set(paths, { strokeDashoffset: 0, fill: (i: number) => (i === 0 ? '#ff1538' : '#fff') })
      tl.set(logo.current, { opacity: 1 })
    } else {
      tl.to(state, { fade: 1, duration: 0.6, ease: 'power2.out' }, 0.25)
        .to(state, { converge: 1, duration: 1.3, ease: 'power2.in' }, 0.55)
        .to(logo.current, { opacity: 1, scale: 1, duration: 0.01 }, 1.35)
        .to(paths, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.1 }, 1.35)
        .to(paths, { fill: (i: number) => (i === 0 ? '#ff1538' : '#ffffff'), duration: 0.4, stagger: 0.08 }, 1.9)
        .to(state, { fade: 0, duration: 0.4 }, 1.9)
        .to(state, { flash: 0.5, duration: 0.25, yoyo: true, repeat: 1 }, 1.9)
    }

    const tick = setInterval(() => {
      const t = (performance.now() - start) / 1000
      const ready = app.isSceneReady()
      const pct = Math.min(ready ? 100 : 92, Math.round((t / MIN_TIME) * 100))
      if (counter.current) counter.current.textContent = `${String(pct).padStart(3, '0')}`
      if ((t >= (reduced ? 0.3 : MIN_TIME) && ready) || t >= MAX_WAIT) {
        clearInterval(tick)
        finish()
      }
    }, 50)

    return () => {
      clearInterval(tick)
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      tl.kill()
    }
  }, [onDone])

  if (gone) return null

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-bg"
      style={{ clipPath: 'circle(150% at 50% 50%)' }}
      role="status"
      aria-label="Loading K76"
    >
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      <svg
        ref={logo}
        viewBox={LOGO_VIEWBOX}
        className="relative w-[min(46vw,320px)] opacity-0 drop-shadow-[0_0_30px_rgba(255,21,56,0.55)]"
        style={{ transform: 'scale(0.96)' }}
        aria-hidden="true"
      >
        {LOGO_PATHS.map((p) => (
          <path key={p.ch} d={p.d} fill="transparent" stroke="#ff1538" strokeWidth={1.2} />
        ))}
      </svg>
      <div className="absolute bottom-8 left-0 right-0 flex items-end justify-between px-[var(--gutter)] font-grotesk text-xs uppercase tracking-[0.25em] text-muted">
        <span>K76 Business Solutions</span>
        <span>
          <span ref={counter} className="font-display text-3xl tracking-normal text-white">
            000
          </span>
        </span>
      </div>
    </div>
  )
}

import { useRef } from 'react'
import { gsap, useGSAP } from '../../animations/gsapAnimations'
import { stats, strengths } from '../../data/company'
import { prefersReducedMotion } from '../../hooks/useMediaQuery'
import SectionLabel from '../../components/Buttons/SectionLabel'

/** Small floating geometric marks that drift at different scroll speeds. */
const FLOATERS = [
  { top: '8%', left: '6%', speed: -160, kind: 'plus' },
  { top: '30%', left: '44%', speed: 120, kind: 'diamond' },
  { top: '58%', left: '12%', speed: -90, kind: 'ring' },
  { top: '74%', left: '52%', speed: 200, kind: 'plus' },
  { top: '88%', left: '28%', speed: -220, kind: 'diamond' },
] as const

function Floater({ kind }: { kind: 'plus' | 'diamond' | 'ring' }) {
  if (kind === 'plus')
    return (
      <svg viewBox="0 0 20 20" className="h-6 w-6 text-accent" aria-hidden>
        <path d="M10 0v20M0 10h20" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  if (kind === 'diamond') return <span className="block h-3 w-3 rotate-45 border border-white/50" aria-hidden />
  return <span className="block h-10 w-10 rounded-full border border-accent/60" aria-hidden />
}

export default function WhyK76() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const reduced = prefersReducedMotion()

      // Animated counters.
      q('[data-count]').forEach((el) => {
        const target = Number(el.getAttribute('data-count'))
        const from = Number(el.getAttribute('data-from') ?? 0)
        if (reduced) {
          el.textContent = String(target)
          return
        }
        const obj = { v: from }
        gsap.to(obj, {
          v: target,
          duration: 2.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v))
          },
        })
      })

      if (reduced) return

      gsap.fromTo(
        q('[data-why-l1]'),
        { xPercent: -30 },
        { xPercent: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 25%', scrub: 1 } },
      )
      gsap.fromTo(
        q('[data-why-l2]'),
        { xPercent: 30 },
        { xPercent: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 25%', scrub: 1 } },
      )

      q('[data-strength]').forEach((card) => {
        const num = card.querySelector('[data-strength-num]')
        gsap
          .timeline({ scrollTrigger: { trigger: card, start: 'top 88%', end: 'top 45%', scrub: 1 } })
          .from(card, { rotateX: 45, rotateY: -12, y: 120, opacity: 0, transformOrigin: '50% 100%', ease: 'none' }, 0)
          .from(num, { scale: 1.8, xPercent: -20, ease: 'none' }, 0)
      })

      q('[data-floater]').forEach((f) => {
        gsap.to(f, {
          y: Number(f.getAttribute('data-speed')),
          rotate: Number(f.getAttribute('data-speed')) * 0.6,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="why" ref={root} className="relative overflow-hidden py-28 md:py-44" aria-labelledby="why-title">
      {FLOATERS.map((f, i) => (
        <div key={i} data-floater data-speed={f.speed} className="pointer-events-none absolute" style={{ top: f.top, left: f.left }}>
          <Floater kind={f.kind} />
        </div>
      ))}

      <div className="wrap relative">
        <div className="flex justify-end">
          <SectionLabel index="03" label="Why K76" />
        </div>
        <h2 id="why-title" className="t-huge mt-10 text-right">
          <span data-why-l1 className="block">
            Why build
          </span>
          <span data-why-l2 className="block">
            with <span className="text-brand">K76?</span>
          </span>
        </h2>

        {/* stats */}
        <dl className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:mt-28 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-bg/80 p-6 backdrop-blur-md md:p-10">
              <dd className="font-display text-[clamp(3rem,7vw,6.5rem)] leading-none">
                {s.prefix}
                <span data-count={s.value} data-from={s.isYear ? 1990 : 0}>
                  {s.value}
                </span>
                <span className="text-lime">{s.suffix}</span>
              </dd>
              <dt className="t-label mt-4 text-muted">{s.label}</dt>
            </div>
          ))}
        </dl>

        {/* strengths: staggered, offset two-column layout on the right of the 3D type */}
        <div className="mt-24 grid gap-6 md:mt-32 md:grid-cols-2 lg:ml-auto lg:w-[64%]" style={{ perspective: '1600px' }}>
          {strengths.map((s, i) => (
            <article
              key={s.title}
              data-strength
              className={`group glass relative overflow-hidden rounded-3xl p-8 transition-colors duration-500 hover:border-accent/70 md:p-10 ${
                i % 2 === 1 ? 'md:translate-y-24' : ''
              }`}
            >
              <span
                data-strength-num
                className="block origin-left font-display text-[5.5rem] leading-none text-outline transition-all duration-500 group-hover:text-accent group-hover:[-webkit-text-stroke-color:transparent]"
              >
                0{i + 1}
              </span>
              <h3 className="mt-8 font-display text-3xl uppercase md:text-4xl">{s.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">{s.body}</p>
              <span
                aria-hidden
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/0 blur-2xl transition-colors duration-700 group-hover:bg-accent/40"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

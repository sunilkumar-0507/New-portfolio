import { useRef } from 'react'
import { gsap, useGSAP } from '../../animations/gsapAnimations'
import { approach } from '../../data/company'
import { prefersReducedMotion } from '../../hooks/useMediaQuery'
import SectionLabel from '../../components/Buttons/SectionLabel'

/**
 * Horizontal process timeline driven by vertical scroll. Uses a CSS sticky
 * stage (no ScrollTrigger pin) so it never fights other triggers' positions.
 */
export default function Approach() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const fill = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = track.current
      if (!el || prefersReducedMotion()) return
      const q = gsap.utils.selector(root)
      const steps = q('[data-step]')
      const distance = () => Math.max(0, el.scrollWidth - window.innerWidth)

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 0.999))
            if (counter.current) counter.current.textContent = `0${idx + 1}`
            steps.forEach((s, i) => s.classList.toggle('is-active', i <= idx))
          },
        },
      })
      tl.to(el, { x: () => -distance() }, 0).fromTo(fill.current, { scaleX: 0 }, { scaleX: 1 }, 0)

      // Each step's giant number counter-scrolls for parallax depth.
      steps.forEach((s) => {
        const num = s.querySelector('[data-step-num]')
        tl.fromTo(num, { xPercent: 40 }, { xPercent: -40 }, 0)
      })
    },
    { scope: root },
  )

  return (
    <section id="approach" ref={root} className="relative h-auto motion-safe:h-[460vh]" aria-labelledby="approach-title">
      <div className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-24 motion-safe:sticky motion-safe:top-0 motion-safe:h-[100svh] motion-safe:py-0">
        <div className="wrap flex items-end justify-between gap-6">
          <div>
            <SectionLabel index="04" label="Our Approach" />
            <h2 id="approach-title" className="t-big mt-6">
              From idea <span className="text-brand">to impact.</span>
            </h2>
          </div>
          <p className="hidden font-display text-7xl leading-none md:block" aria-hidden>
            <span ref={counter} className="text-accent">
              01
            </span>
            <span className="text-white/25"> / 05</span>
          </p>
        </div>

        <div className="relative mt-12 md:mt-16">
          {/* progress rail */}
          <div className="wrap">
            <div className="relative h-px w-full bg-line">
              <div ref={fill} className="absolute inset-0 origin-left bg-accent shadow-[0_0_12px_rgba(139,63,217,0.9)]" />
            </div>
          </div>

          <div
            ref={track}
            className="mt-10 flex gap-6 px-[var(--gutter)] will-change-transform motion-reduce:flex-col md:gap-10"
          >
            {approach.map((step) => (
              <article
                key={step.index}
                data-step
                className="group glass relative flex w-[82vw] shrink-0 flex-col justify-between overflow-hidden rounded-3xl p-8 transition-colors duration-700 motion-reduce:w-full sm:w-[60vw] md:h-[52vh] md:w-[42vw] md:p-12 lg:w-[34vw] [&.is-active]:border-accent/60"
              >
                <span
                  data-step-num
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-8 font-display text-[11rem] leading-none text-outline opacity-40 transition-opacity duration-700 md:text-[16rem] [.is-active>&]:opacity-80"
                >
                  {step.index}
                </span>
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rotate-45 border border-accent transition-colors duration-500 [.is-active_&]:bg-accent" />
                  <span className="t-label text-muted">Step {step.index}</span>
                </div>
                <div className="relative mt-16">
                  <h3 className="font-display text-[clamp(2.8rem,5vw,5.4rem)] uppercase leading-none">{step.title}</h3>
                  <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70 md:text-base">{step.body}</p>
                </div>
              </article>
            ))}
            <div className="flex w-[30vw] shrink-0 items-center motion-reduce:hidden" aria-hidden>
              <span className="font-display text-[8vw] uppercase leading-none text-white/10">Grow →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

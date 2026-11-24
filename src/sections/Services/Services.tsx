import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { gsap, revealLines, scrollToSection, useGSAP } from '../../animations/gsapAnimations'
import { servicePanel } from '../../animations/transitions'
import { services, type Service } from '../../data/services'
import { industries } from '../../data/company'
import { isCoarsePointer, prefersReducedMotion, useCoarsePointer } from '../../hooks/useMediaQuery'
import SectionLabel from '../../components/Buttons/SectionLabel'

/** Animated visual for a service: icon inside counter-rotating dashed orbits. */
function ServiceVisual({ service, size = 'lg' }: { service: Service; size?: 'lg' | 'sm' }) {
  const Icon = service.icon
  const box = size === 'lg' ? 'h-44 w-44' : 'h-24 w-24'
  return (
    <div className={`relative ${box} shrink-0`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" style={{ animation: 'spin-slow 14s linear infinite' }} aria-hidden>
        <circle cx="50" cy="50" r="47" fill="none" stroke="#8b3fd9" strokeWidth="0.6" strokeDasharray="2 4" />
        <circle cx="50" cy="3" r="2.2" fill="#8b3fd9" />
      </svg>
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-[14%] h-[72%] w-[72%]"
        style={{ animation: 'spin-slow 9s linear infinite reverse' }}
        aria-hidden
      >
        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" strokeDasharray="30 10 4 10" />
        <rect x="47" y="1" width="6" height="6" fill="#fff" transform="rotate(45 50 4)" />
      </svg>
      <div className="absolute inset-[30%] flex items-center justify-center rounded-full bg-accent shadow-[0_0_50px_-6px_rgba(139,63,217,0.9)]">
        <Icon className="h-1/2 w-1/2 text-white" strokeWidth={1.6} aria-hidden />
      </div>
    </div>
  )
}

export default function Services() {
  const root = useRef<HTMLElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const [open, setOpen] = useState<number | null>(0)
  const coarse = useCoarsePointer()

  // Cursor-following preview card (desktop).
  useEffect(() => {
    const el = preview.current
    const wrap = list.current
    if (!el || !wrap || isCoarsePointer()) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' })
    const rTo = gsap.quickTo(el, 'rotate', { duration: 0.9, ease: 'power3.out' })
    let lastX = 0
    const move = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      const x = e.clientX - r.left
      xTo(x)
      yTo(e.clientY - r.top)
      rTo(gsap.utils.clamp(-12, 12, (x - lastX) * 0.6))
      lastX = x
    }
    wrap.addEventListener('pointermove', move)
    return () => wrap.removeEventListener('pointermove', move)
  }, [])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(root)
      q('[data-reveal-lines]').forEach((el) => revealLines(el))
      // Rows sweep in with a 3D tilt, staggered by scroll.
      q('[data-service-row]').forEach((row, i) => {
        gsap.from(row, {
          xPercent: i % 2 ? 8 : -8,
          rotateY: i % 2 ? -12 : 12,
          opacity: 0,
          duration: 1.4,
          scrollTrigger: { trigger: row, start: 'top 92%', toggleActions: 'play none none reverse' },
        })
      })
      gsap.fromTo(
        q('[data-services-big]'),
        { xPercent: 10 },
        { xPercent: -25, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    },
    { scope: root },
  )

  const current = active !== null ? services[active] : null

  return (
    <section id="services" ref={root} className="relative overflow-hidden py-28 md:py-44" aria-labelledby="services-title">
      {/* drifting outline type in the background */}
      <div
        data-services-big
        aria-hidden
        className="pointer-events-none absolute left-0 top-24 whitespace-nowrap font-display text-[28vw] uppercase leading-none text-outline opacity-[0.07]"
      >
        What we do · What we do
      </div>

      <div className="wrap relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="02" label="What We Do" />
            <h2 id="services-title" className="t-huge mt-10">
              Every growth
              <br />
              lever. <span className="text-brand">One team.</span>
            </h2>
          </div>
          <p data-reveal-lines className="max-w-md text-base leading-relaxed text-muted md:text-lg lg:col-span-4 lg:col-start-9">
            From the first ad campaign to a custom ERP and an AI workflow, K76 ships the full stack of growth services under one
            roof.
          </p>
        </div>

        <div
          ref={list}
          className="relative mt-16 md:mt-24"
          onPointerLeave={() => setActive(null)}
          style={{ perspective: '1400px' }}
        >
          {/* floating preview (desktop) */}
          {!coarse && (
            <div
              ref={preview}
              className="pointer-events-none absolute left-0 top-0 z-20 ml-[48px] -mt-[170px] hidden lg:block"
              style={{ perspective: '800px' }}
              aria-hidden
            >
              <AnimatePresence mode="wait">
                {current && (
                  <motion.div
                    key={current.index}
                    variants={servicePanel}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="glass flex h-[320px] w-[260px] flex-col justify-between rounded-3xl p-6"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-4xl text-accent">{current.index}</span>
                      <span className="t-label text-muted">/ 09</span>
                    </div>
                    <div className="flex justify-center">
                      <ServiceVisual service={current} />
                    </div>
                    <p className="t-label text-center text-white/70">{current.short}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <ul>
            {services.map((s, i) => {
              const isOpen = coarse ? open === i : active === i
              return (
                <li key={s.index} data-service-row className="relative border-t border-line last:border-b">
                  <button
                    type="button"
                    className="group relative block w-full overflow-hidden text-left"
                    onPointerEnter={() => !coarse && setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => (coarse ? setOpen(open === i ? null : i) : scrollToSection('contact'))}
                    aria-expanded={coarse ? isOpen : undefined}
                    aria-label={coarse ? undefined : `${s.title} — enquire`}
                  >
                    {/* red fill sweep */}
                    <span
                      aria-hidden
                      className={`absolute inset-0 origin-bottom bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen && !coarse ? 'scale-y-100' : 'scale-y-0'
                      }`}
                    />
                    <span className="relative grid grid-cols-[auto_1fr_auto] items-center gap-4 py-6 md:gap-10 md:py-8">
                      <span
                        className={`font-grotesk text-sm tabular-nums transition-colors duration-500 ${
                          isOpen && !coarse ? 'text-black/60' : 'text-accent'
                        }`}
                      >
                        {s.index}
                      </span>
                      <span
                        className={`font-display text-[clamp(1.7rem,4.6vw,4.9rem)] uppercase leading-[0.95] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isOpen && !coarse ? 'translate-x-3 md:translate-x-8' : ''
                        }`}
                      >
                        {s.title}
                      </span>
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 md:h-14 md:w-14 ${
                          isOpen ? 'rotate-45 border-white bg-white text-black' : 'border-white/20 text-white'
                        }`}
                      >
                        {coarse ? <Plus className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5 rotate-45" />}
                      </span>
                    </span>

                    {/* desktop: description slides in on hover */}
                    {!coarse && (
                      <span
                        className={`relative hidden overflow-hidden transition-[max-height,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block ${
                          isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <span className="grid grid-cols-12 gap-6 pb-8">
                          <span className="col-span-5 col-start-2 text-base leading-relaxed text-white">{s.description}</span>
                          <span className="col-span-5 col-start-8 flex flex-wrap content-start gap-2">
                            {s.tags.map((t) => (
                              <span key={t} className="rounded-full border border-white/40 px-3 py-1 text-xs text-white">
                                {t}
                              </span>
                            ))}
                          </span>
                        </span>
                      </span>
                    )}
                  </button>

                  {/* touch: accordion */}
                  {coarse && (
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="flex gap-5 pb-8">
                            <ServiceVisual service={s} size="sm" />
                            <div>
                              <p className="text-sm leading-relaxed text-white/80">{s.description}</p>
                              <div className="mt-4 flex flex-wrap gap-2">
                                {s.tags.map((t) => (
                                  <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* industries marquee */}
      <div className="relative mt-24 border-y border-line bg-bg/60 py-6 backdrop-blur-sm" aria-label="Industries we serve">
        <div className="marquee-track gap-0">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
              {industries.map((ind) => (
                <span key={ind} className="flex items-center font-display text-3xl uppercase text-white/80 md:text-5xl">
                  <span className="px-8">{ind}</span>
                  <span className="h-2.5 w-2.5 rotate-45 bg-accent" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

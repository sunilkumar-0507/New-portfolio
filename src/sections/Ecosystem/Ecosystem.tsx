import { useRef } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { gsap, revealLines, useGSAP } from '../../animations/gsapAnimations'
import { divisions, flywheel, learnPrograms, type Division } from '../../data/company'
import { prefersReducedMotion } from '../../hooks/useMediaQuery'
import SectionLabel from '../../components/Buttons/SectionLabel'
import MagneticButton from '../../components/Buttons/MagneticButton'

/* --------------------------------------------- distinctive division glyphs */

function GridGlyph() {
  // Business Solutions — a 4×4 matrix of modules lighting up in waves.
  return (
    <div className="grid h-40 w-40 grid-cols-4 gap-2" aria-hidden>
      {Array.from({ length: 16 }, (_, i) => (
        <span
          key={i}
          className="rounded-[3px] bg-white/10"
          style={{
            animation: `eco-pulse 2.4s ${((i % 4) + Math.floor(i / 4)) * 0.12}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}

function StepsGlyph() {
  // K76 Learn — ascending bars: skills compounding cohort by cohort.
  return (
    <div className="flex h-40 w-40 items-end gap-2" aria-hidden>
      {[28, 44, 60, 78, 100].map((h, i) => (
        <span
          key={h}
          className="flex-1 origin-bottom rounded-t-[3px] bg-gradient-to-t from-accent-2 to-accent"
          style={{ height: `${h}%`, animation: `eco-grow 2.6s ${i * 0.15}s ease-in-out infinite` }}
        />
      ))}
    </div>
  )
}

function ModulesGlyph() {
  // K76 Products — stacked isometric software layers.
  return (
    <div className="relative h-40 w-40" style={{ perspective: '400px' }} aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 rounded-lg border border-accent/80"
          style={{
            background: i === 0 ? 'rgba(255,21,56,0.85)' : 'rgba(255,21,56,0.08)',
            transform: `translate(-50%, ${-50 + (i - 1) * 34}%) rotateX(60deg) rotateZ(45deg)`,
            animation: `eco-float 3s ${i * 0.25}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}

const GLYPHS: Record<Division['id'], () => React.JSX.Element> = {
  solutions: GridGlyph,
  learn: StepsGlyph,
  products: ModulesGlyph,
}

function DivisionCard({ d, i }: { d: Division; i: number }) {
  const Glyph = GLYPHS[d.id]
  return (
    <article
      data-division
      className="relative overflow-hidden rounded-[2rem] [@media(min-width:1024px)_and_(min-height:760px)]:sticky border border-line bg-[#0b0b0b]/90 shadow-[0_-30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
      style={{ top: `calc(12vh + ${i * 28}px)` }}
      aria-labelledby={`division-${d.id}`}
    >
      <div className="grid gap-10 p-8 md:p-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-4">
            <span className="font-display text-2xl text-accent">{d.index}</span>
            <span className="t-label text-muted">{d.kicker}</span>
          </div>
          <h3 id={`division-${d.id}`} className="mt-6 font-display text-[clamp(2.6rem,6vw,6rem)] uppercase leading-[0.9]">
            {d.title}
          </h3>
          <p className="mt-3 font-grotesk text-sm uppercase tracking-[0.2em] text-accent">{d.role}</p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">{d.summary}</p>

          {d.id === 'learn' ? (
            <ul className="mt-8 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              {learnPrograms.map((p) => (
                <li key={p.title} className="bg-bg-2 p-4">
                  <p className="font-grotesk text-sm font-semibold">{p.title}</p>
                  <p className="t-label mt-1 text-accent">{p.weeks} weeks</p>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-8 flex max-w-xl flex-wrap gap-2">
              {d.items.map((it) => (
                <li key={it} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80">
                  {it}
                </li>
              ))}
            </ul>
          )}

          {d.href && (
            <div className="mt-10">
              <MagneticButton href={d.href} external variant="primary" cursor="Visit">
                {d.hrefLabel} <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center lg:col-span-5">
          <div className="relative flex h-64 w-64 items-center justify-center md:h-80 md:w-80">
            <span className="absolute inset-0 rounded-full border border-dashed border-accent/40" style={{ animation: 'spin-slow 30s linear infinite' }} />
            <span className="absolute inset-8 rounded-full border border-white/10" />
            <span className="absolute inset-0 rounded-full bg-accent/10 blur-3xl" />
            <Glyph />
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Ecosystem() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(root)
      q('[data-reveal-lines]').forEach((el) => revealLines(el))
      const cards = q('[data-division]')
      // Stacking cards: each card recedes as the next one slides over it.
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (!next) return
        gsap.to(card, {
          scale: 0.92,
          filter: 'brightness(0.45)',
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true },
        })
      })
      gsap.from(q('[data-fly]'), {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 1.2,
        scrollTrigger: { trigger: q('[data-flywheel]')[0], start: 'top 85%' },
      })
    },
    { scope: root },
  )

  return (
    <section id="ecosystem" ref={root} className="relative py-28 md:py-44" aria-labelledby="eco-title">
      <style>{`
        @keyframes eco-pulse { 0%,100% { background: rgba(255,255,255,0.08) } 45% { background: #ff1538; box-shadow: 0 0 18px rgba(255,21,56,.7) } }
        @keyframes eco-grow { 0%,100% { transform: scaleY(.55) } 50% { transform: scaleY(1) } }
        @keyframes eco-float { 0%,100% { margin-top: 0 } 50% { margin-top: -10px } }
      `}</style>

      <div className="wrap">
        <div className="mx-auto max-w-5xl text-center">
          <SectionLabel index="05" label="K76 Ecosystem" align="center" />
          <h2 id="eco-title" className="t-huge mt-10">
            One studio.
            <br />
            <span className="text-accent">Three engines.</span>
          </h2>
          <p data-reveal-lines className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            Business Solutions builds and grows companies. K76 Learn trains the people who do the work. K76 Products turns what we
            build into software anyone can run.
          </p>
        </div>

        <div className="relative mt-20 space-y-8 md:mt-28">
          {divisions.map((d, i) => (
            <DivisionCard key={d.id} d={d} i={i} />
          ))}
        </div>

        {/* flywheel */}
        <div data-flywheel className="mt-24 md:mt-32">
          <p className="t-label text-center text-muted">The K76 flywheel</p>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {flywheel.map((f) => (
              <li key={f.label} data-fly className="glass flex items-center justify-between gap-4 rounded-2xl px-6 py-5">
                <span className="font-grotesk text-sm text-white/70">{f.from}</span>
                <span className="flex flex-col items-center">
                  <span className="t-label text-accent">{f.label}</span>
                  <ArrowRight className="mt-1 h-4 w-4 text-accent" aria-hidden />
                </span>
                <span className="font-grotesk text-sm text-white/70">{f.to}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

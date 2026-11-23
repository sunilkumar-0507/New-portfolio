import { useRef } from 'react'
import { Quote } from 'lucide-react'
import { gsap, inkWords, revealLines, useGSAP } from '../../animations/gsapAnimations'
import { about, founder, milestones, philosophy, principles } from '../../data/company'
import { prefersReducedMotion } from '../../hooks/useMediaQuery'
import SectionLabel from '../../components/Buttons/SectionLabel'

const MANIFESTO = [
  { key: 'Vision', text: about.vision },
  { key: 'Mission', text: about.mission },
  { key: 'Promise', text: about.promise },
] as const

export default function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const reduced = prefersReducedMotion()
      if (reduced) return

      q('[data-reveal-lines]').forEach((el) => revealLines(el))
      q('[data-ink]').forEach((el) => inkWords(el))

      // Headline: second line slides in from the right with skew, scrubbed.
      gsap.fromTo(
        q('[data-about-l2]'),
        { xPercent: 22, skewX: -12 },
        {
          xPercent: 0,
          skewX: 0,
          ease: 'none',
          scrollTrigger: { trigger: q('[data-about-head]')[0], start: 'top 95%', end: 'top 35%', scrub: 1 },
        },
      )

      // Manifesto rows: 3D flip up as they enter.
      q('[data-manifesto-row]').forEach((row) => {
        gsap.from(row, {
          rotateX: -65,
          opacity: 0,
          y: 60,
          transformOrigin: '50% 0%',
          duration: 1.3,
          scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none reverse' },
        })
        gsap.fromTo(
          row.querySelector('[data-row-line]'),
          { scaleX: 0 },
          { scaleX: 1, duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: row, start: 'top 88%' } },
        )
      })

      gsap.from(q('[data-pill]'), {
        y: 30,
        opacity: 0,
        stagger: 0.06,
        duration: 1,
        scrollTrigger: { trigger: q('[data-pills]')[0], start: 'top 85%' },
      })

      gsap.from(q('[data-milestone]'), {
        y: 80,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        scrollTrigger: { trigger: q('[data-milestones]')[0], start: 'top 85%' },
      })
      gsap.fromTo(
        q('[data-milestone-track]'),
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: q('[data-milestones]')[0], start: 'top 80%', end: 'bottom 60%', scrub: 1 },
        },
      )
    },
    { scope: root },
  )

  return (
    <section id="about" ref={root} className="relative py-28 md:py-44" aria-labelledby="about-title">
      <div className="wrap">
        <SectionLabel index="01" label="About K76" />

        <h2 id="about-title" data-about-head className="t-huge mt-10 overflow-hidden">
          <span className="block">We are K76.</span>
          <span data-about-l2 className="block">
            We build
            <br />
            <span className="text-accent">the future.</span>
          </span>
        </h2>

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12">
          <p data-ink className="font-grotesk text-[clamp(1.4rem,2.6vw,2.4rem)] font-medium leading-[1.2] tracking-[-0.01em] lg:col-span-8">
            {about.who}
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:w-2/3">
          <p data-reveal-lines className="text-base leading-relaxed text-muted md:text-lg">
            {about.origin}
          </p>
          <p data-reveal-lines className="text-base leading-relaxed text-muted md:text-lg">
            {about.today}
          </p>
        </div>

        {/* Manifesto: vision / mission / promise */}
        <div className="mt-24 md:mt-36" style={{ perspective: '1200px' }}>
          {MANIFESTO.map((m, i) => (
            <div
              key={m.key}
              data-manifesto-row
              className="group relative grid gap-4 py-8 md:grid-cols-12 md:items-baseline md:py-12"
            >
              <span data-row-line className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
              <span className="absolute left-0 top-0 h-px w-0 bg-accent transition-all duration-700 group-hover:w-full" />
              <div className="t-label flex items-center gap-3 text-muted md:col-span-3">
                <span className="text-accent">0{i + 1}</span> {m.key}
              </div>
              <p className="font-display text-[clamp(1.9rem,4.4vw,4.4rem)] uppercase leading-[0.95] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 md:col-span-9">
                {m.text}
              </p>
            </div>
          ))}
        </div>

        {/* Philosophy + approach */}
        <div className="mt-24 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="t-label text-accent">Company philosophy</p>
            <h3 className="t-big mt-4">
              Craft,
              <br />
              clarity &amp; <span className="text-outline">care.</span>
            </h3>
            <p className="mt-6 max-w-md text-muted">
              We built K76 to be the partner we wished existed — one team that connects strategy, software, brand and growth.
            </p>
          </div>
          <div data-pills className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:col-span-7">
            {philosophy.map((p, i) => (
              <div
                key={p.title}
                data-pill
                className="group relative overflow-hidden bg-bg-2/90 p-7 backdrop-blur-md transition-colors duration-500 hover:bg-accent md:p-9"
              >
                <span className="t-label text-accent transition-colors group-hover:text-black/60">0{i + 1}</span>
                <h4 className="mt-6 font-display text-3xl uppercase">{p.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-muted transition-colors group-hover:text-white/90">{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="t-label text-accent">Our approach</p>
            <p className="mt-4 max-w-md font-grotesk text-xl leading-snug text-white/85">{about.promise}</p>
          </div>
          <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:col-span-7">
            {principles.map((p) => (
              <li key={p.title} className="flex gap-4 border-t border-line pt-5">
                <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-accent" aria-hidden />
                <div>
                  <p className="font-grotesk text-lg font-semibold">{p.title}</p>
                  <p className="mt-1 text-sm text-muted">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Founder */}
        <figure className="glass relative mt-24 overflow-hidden rounded-3xl p-8 md:mt-32 md:p-16">
          <Quote className="h-10 w-10 text-accent" strokeWidth={1.5} aria-hidden />
          <blockquote data-reveal-lines className="mt-6 max-w-4xl font-grotesk text-[clamp(1.4rem,3vw,2.6rem)] font-medium leading-[1.15]">
            “{founder.quote}”
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-4">
            <span className="h-px w-10 bg-accent" />
            <span>
              <span className="block font-grotesk font-semibold">{founder.name}</span>
              <span className="t-label text-muted">{founder.role}</span>
            </span>
          </figcaption>
          <span aria-hidden className="pointer-events-none absolute -bottom-16 -right-6 font-display text-[16rem] leading-none text-white/[0.03]">
            K76
          </span>
        </figure>

        {/* Milestones */}
        <div data-milestones className="relative mt-24 md:mt-32">
          <div className="flex items-end justify-between gap-6">
            <h3 className="t-big">
              Five years of <span className="text-accent">compounding.</span>
            </h3>
          </div>
          <div className="relative mt-12">
            <div className="absolute left-0 right-0 top-[1.15rem] hidden h-px bg-line md:block" />
            <div data-milestone-track className="absolute left-0 right-0 top-[1.15rem] hidden h-px origin-left bg-accent md:block" />
            <ol className="grid gap-10 md:grid-cols-5 md:gap-6">
              {milestones.map((m) => (
                <li key={m.year} data-milestone className="relative">
                  <span className="relative z-10 hidden h-2.5 w-2.5 translate-y-3.5 rotate-45 bg-accent md:block" aria-hidden />
                  <p className="font-display text-5xl md:mt-8">{m.year}</p>
                  <p className="mt-3 font-grotesk font-semibold">{m.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{m.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

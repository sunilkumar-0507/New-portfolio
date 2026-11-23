import { useRef } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { gsap, SplitText, scrollToSection, useGSAP } from '../../animations/gsapAnimations'
import { company } from '../../data/company'
import { usePhase } from '../../lib/store'
import { prefersReducedMotion } from '../../hooks/useMediaQuery'
import MagneticButton from '../../components/Buttons/MagneticButton'

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const phase = usePhase()
  const started = phase !== 'loading'

  // Entrance — runs once the loader hands over.
  useGSAP(
    () => {
      if (!started) return
      const reduced = prefersReducedMotion()
      const q = gsap.utils.selector(root)
      if (reduced) {
        gsap.set(q('[data-hero-fade], [data-hero-line]'), { opacity: 1, y: 0 })
        return
      }
      const split = SplitText.create(q('[data-hero-line]'), { type: 'chars', mask: 'chars' })
      gsap.set(q('[data-hero-line]'), { opacity: 1 })
      const tl = gsap.timeline({ delay: 0.75 })
      tl.from(split.chars, {
        yPercent: 120,
        rotateX: -80,
        transformOrigin: '50% 100%',
        duration: 1.4,
        stagger: 0.035,
        ease: 'expo.out',
      })
        .fromTo(
          q('[data-hero-fade]'),
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.09, ease: 'expo.out' },
          0.5,
        )
        .fromTo(q('[data-hero-rule]'), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'expo.inOut' }, 0.2)
    },
    { scope: root, dependencies: [started] },
  )

  // Scroll: headline lines drift apart and scale away while the 3D type flies off.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(root)
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      tl.to(q('[data-hero-l1]'), { xPercent: -18, ease: 'none' }, 0)
        .to(q('[data-hero-l2]'), { xPercent: 14, ease: 'none' }, 0)
        .to(q('[data-hero-headline]'), { scale: 1.12, opacity: 0, transformOrigin: '0% 100%', ease: 'power1.in' }, 0)
        .to(q('[data-hero-side]'), { y: -120, opacity: 0, ease: 'none' }, 0)
      return () => tl.scrollTrigger?.kill()
    },
    { scope: root },
  )

  return (
    <section
      id="home"
      ref={root}
      className="relative flex h-[100svh] min-h-[640px] flex-col justify-between overflow-hidden pb-8 pt-28 md:pb-10"
      aria-label="Introduction"
    >
      {/* top meta row */}
      <div className="wrap flex items-start justify-between" data-hero-side>
        <p data-hero-fade className="t-label max-w-[18ch] leading-relaxed text-muted opacity-0">
          <span className="text-accent">●</span> {company.name}
        </p>
        <p data-hero-fade className="t-label hidden text-right leading-relaxed text-muted opacity-0 sm:block">
          Est. {company.founded}
          <br />
          Chennai &amp; Tenkasi — India
        </p>
      </div>

      {/* vertical tagline */}
      <p
        data-hero-fade
        className="t-label pointer-events-none absolute right-[var(--gutter)] top-1/2 hidden origin-right -translate-y-1/2 translate-x-1/2 rotate-90 text-white/35 opacity-0 [@media(min-width:1280px)_and_(min-height:820px)]:block"
        style={{ transformOrigin: 'center' }}
      >
        {company.tagline}
      </p>

      <div className="wrap">
        <div data-hero-rule className="mb-6 h-px w-full origin-left bg-gradient-to-r from-accent via-white/20 to-transparent" />
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <h1
            data-hero-headline
            className="font-display uppercase leading-[0.84] tracking-[-0.005em] drop-shadow-[0_6px_28px_rgba(0,0,0,0.55)] lg:col-span-8"
            style={{ fontSize: 'clamp(3.4rem, min(11vw, 21vh), 12.5rem)', perspective: '600px' }}
          >
            <span data-hero-l1 className="block">
              <span data-hero-line className="block opacity-0">
                Building
              </span>
            </span>
            <span data-hero-l2 className="block">
              <span data-hero-line className="block opacity-0">
                What&rsquo;s <span className="text-accent">Next.</span>
              </span>
            </span>
          </h1>

          <div className="space-y-7 lg:col-span-4 lg:pb-4" data-hero-side>
            <p data-hero-fade className="max-w-[38ch] font-grotesk text-base leading-relaxed text-white/75 opacity-0 md:text-lg">
              We transform ideas into powerful digital experiences through technology, creativity and innovation.
            </p>
            <div data-hero-fade className="flex flex-wrap gap-3 opacity-0">
              <MagneticButton onClick={() => scrollToSection('about')} variant="primary" cursor="Explore">
                Explore K76 <ArrowDown className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton onClick={() => scrollToSection('contact')} variant="ghost" cursor="Talk">
                Let&rsquo;s Talk <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* scroll indicator */}
        <button
          type="button"
          data-hero-fade
          onClick={() => scrollToSection('about')}
          className="group mx-auto mt-8 flex flex-col items-center gap-2 opacity-0"
          aria-label="Scroll to About"
        >
          <span className="relative flex h-9 w-5 justify-center rounded-full border border-white/40 pt-1.5">
            <span className="h-1.5 w-1 rounded-full bg-accent" style={{ animation: 'scroll-dot 1.8s ease-in-out infinite' }} />
          </span>
          <span className="t-label text-[0.6rem] text-muted transition-colors group-hover:text-white">Scroll</span>
        </button>
      </div>
    </section>
  )
}


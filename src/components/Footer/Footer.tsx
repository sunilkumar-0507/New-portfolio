import { useRef } from 'react'
import { ArrowUp } from 'lucide-react'
import { gsap, scrollToSection, useGSAP } from '../../animations/gsapAnimations'
import { company, offices, socials, whatsappLink } from '../../data/company'
import { footerNav } from '../../data/navigation'
import { services } from '../../data/services'
import { prefersReducedMotion } from '../../hooks/useMediaQuery'
import Logo from '../Buttons/Logo'
import BrandMark from '../Buttons/BrandMark'
import MagneticButton from '../Buttons/MagneticButton'
import SocialIcon from '../Buttons/SocialIcon'

export default function Footer() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('[data-footer-logo]', {
        yPercent: 60,
        scaleY: 1.6,
        opacity: 0,
        transformOrigin: '50% 100%',
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: 1 },
      })
    },
    { scope: root },
  )

  const year = new Date().getFullYear()

  return (
    <footer ref={root} className="relative z-10 overflow-hidden border-t border-line bg-bg/85 backdrop-blur-xl">
      <div className="wrap pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4">
              <BrandMark className="h-14 w-14" />
              <Logo className="h-9 w-auto" />
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">{company.description}</p>
            <p className="t-label mt-6 text-white/60">{company.tagline}</p>
          </div>

          <nav className="lg:col-span-2" aria-label="Footer">
            <p className="t-label text-accent">Navigate</p>
            <ul className="mt-5 space-y-2.5">
              {footerNav.map((n) => (
                <li key={`${n.id}-${n.label}`}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(n.id)}
                    className="text-sm text-white/75 transition-colors hover:text-accent"
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="t-label text-accent">Services</p>
            <ul className="mt-5 space-y-2.5">
              {services.map((s) => (
                <li key={s.index}>
                  <button
                    type="button"
                    onClick={() => scrollToSection('services')}
                    className="text-left text-sm text-white/75 transition-colors hover:text-accent"
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5 lg:col-span-3">
            <p className="t-label text-accent">Contact</p>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li>
                <a className="hover:text-accent" href={`mailto:${company.email}`}>
                  {company.email}
                </a>
              </li>
              <li>
                <a className="hover:text-accent" href={`tel:${company.phoneE164}`}>
                  {company.phoneDisplay}
                </a>
              </li>
              <li>
                <a className="hover:text-accent" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              {offices.map((o) => (
                <li key={o.label} className="text-muted">
                  {o.lines.join(', ')}, {o.city} {o.postalCode}
                </li>
              ))}
            </ul>
            <ul className="flex gap-3">
              {socials.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} — ${s.handle}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-white/80 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:bg-accent hover:text-white"
                  >
                    <SocialIcon k={s.key} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col-reverse items-start justify-between gap-6 border-t border-line py-8 text-xs text-muted md:flex-row md:items-center">
          <p>
            © {year} {company.name}. All rights reserved.
          </p>
          <MagneticButton onClick={() => scrollToSection('home')} variant="ghost" className="!px-5 !py-3 !text-xs" cursor="Top">
            Back to top <ArrowUp className="h-4 w-4" />
          </MagneticButton>
        </div>
      </div>

      <div className="pointer-events-none select-none px-[var(--gutter)]" aria-hidden>
        <div data-footer-logo className="-mb-[2vw]">
          <Logo className="h-auto w-full opacity-90" />
        </div>
      </div>
    </footer>
  )
}

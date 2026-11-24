import { useRef } from 'react'
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { gsap, paintBrandChars, SplitText, useGSAP } from '../../animations/gsapAnimations'
import { company, mailtoLink, offices, socials, whatsappLink } from '../../data/company'
import { prefersReducedMotion } from '../../hooks/useMediaQuery'
import SectionLabel from '../../components/Buttons/SectionLabel'
import MagneticButton from '../../components/Buttons/MagneticButton'
import SocialIcon, { WhatsAppIcon } from '../../components/Buttons/SocialIcon'

const WA_TEXT = 'Hi K76, I have an idea I would like to discuss.'

export default function Contact() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(root)
      SplitText.create(q('[data-contact-line]'), {
        type: 'chars',
        mask: 'chars',
        autoSplit: true,
        onSplit(self) {
          paintBrandChars(self.chars)
          return gsap.from(self.chars, {
            yPercent: 110,
            rotate: 8,
            stagger: { each: 0.025, from: 'center' },
            duration: 1.2,
            scrollTrigger: { trigger: q('[data-contact-head]')[0], start: 'top 80%', toggleActions: 'play none none reverse' },
          })
        },
      })
      gsap.from(q('[data-contact-card]'), {
        y: 80,
        rotateX: -30,
        opacity: 0,
        stagger: 0.08,
        duration: 1.3,
        transformOrigin: '50% 0%',
        scrollTrigger: { trigger: q('[data-contact-grid]')[0], start: 'top 85%' },
      })
    },
    { scope: root },
  )

  return (
    <section id="contact" ref={root} className="relative overflow-hidden pb-24 pt-28 md:pb-32 md:pt-44" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionLabel index="06" label="Contact" align="center" />
        <h2 id="contact-title" data-contact-head className="t-huge mt-10 text-center drop-shadow-[0_6px_30px_rgba(0,0,0,0.65)]">
          <span data-contact-line className="block">
            Have an idea?
          </span>
          <span data-contact-line className="block">
            Let&rsquo;s make it <span className="text-brand">real.</span>
          </span>
        </h2>

        <div className="mt-12 flex flex-col items-center gap-8">
          <a
            href={mailtoLink('New project enquiry')}
            className="group relative font-grotesk text-[clamp(1.6rem,4.5vw,4rem)] font-semibold tracking-[-0.02em]"
            data-cursor="Email"
          >
            {company.email}
            <span className="absolute -bottom-1 left-0 h-[3px] w-full origin-right scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
          </a>
          <div className="flex flex-wrap justify-center gap-3">
            <MagneticButton href={whatsappLink(WA_TEXT)} external variant="primary" cursor="Chat">
              <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp
            </MagneticButton>
            <MagneticButton href={`tel:${company.phoneE164}`} variant="ghost" cursor="Call">
              <Phone className="h-4 w-4" /> {company.phoneDisplay}
            </MagneticButton>
          </div>
        </div>

        <div data-contact-grid className="mt-20 grid gap-4 md:mt-28 md:grid-cols-2 lg:grid-cols-4" style={{ perspective: '1400px' }}>
          <a
            data-contact-card
            href={mailtoLink('New project enquiry')}
            className="group glass flex flex-col justify-between gap-10 rounded-3xl p-7 transition-colors duration-500 hover:border-accent"
          >
            <Mail className="h-6 w-6 text-accent" aria-hidden />
            <div>
              <p className="t-label text-muted">Email</p>
              <p className="mt-2 flex items-center gap-2 font-grotesk text-lg font-semibold">
                {company.email} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </p>
            </div>
          </a>
          <a
            data-contact-card
            href={`tel:${company.phoneE164}`}
            className="group glass flex flex-col justify-between gap-10 rounded-3xl p-7 transition-colors duration-500 hover:border-accent"
          >
            <Phone className="h-6 w-6 text-accent" aria-hidden />
            <div>
              <p className="t-label text-muted">Phone / WhatsApp</p>
              <p className="mt-2 flex items-center gap-2 font-grotesk text-lg font-semibold">
                {company.phoneDisplay} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </p>
            </div>
          </a>
          <div data-contact-card className="glass flex flex-col justify-between gap-10 rounded-3xl p-7">
            <Clock className="h-6 w-6 text-accent" aria-hidden />
            <div>
              <p className="t-label text-muted">Hours</p>
              <p className="mt-2 font-grotesk text-lg font-semibold">{company.hours}</p>
              <p className="mt-1 text-sm text-muted">We reply within one business day.</p>
            </div>
          </div>
          <div data-contact-card className="glass flex flex-col justify-between gap-6 rounded-3xl p-7">
            <p className="t-label text-muted">Follow K76</p>
            <ul className="space-y-3">
              {socials.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 text-white/80 transition-colors hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <SocialIcon k={s.key} />
                      <span className="font-grotesk text-sm">{s.label}</span>
                    </span>
                    <span className="text-xs text-muted transition-colors group-hover:text-accent">{s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {offices.map((o) => (
            <div key={o.label} data-contact-card className="glass flex gap-5 rounded-3xl p-7 md:col-span-1 lg:col-span-2">
              <MapPin className="h-6 w-6 shrink-0 text-accent" aria-hidden />
              <address className="not-italic">
                <p className="t-label text-muted">{o.label}</p>
                <p className="mt-2 font-grotesk text-lg font-semibold">
                  {o.lines.join(', ')}
                </p>
                <p className="text-sm text-muted">
                  {o.city} — {o.postalCode}
                </p>
              </address>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

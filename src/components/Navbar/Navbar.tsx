import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { navItems } from '../../data/navigation'
import { company, socials, whatsappLink } from '../../data/company'
import { lockScroll, scrollToSection } from '../../animations/gsapAnimations'
import { menuItem, menuOverlay, easeExpo } from '../../animations/transitions'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { usePhase } from '../../lib/store'
import Logo from '../Buttons/Logo'
import MagneticButton from '../Buttons/MagneticButton'
import SocialIcon from '../Buttons/SocialIcon'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [hidden, setHidden] = useState(false)
  const bar = useRef<HTMLDivElement>(null)
  const lastY = useRef(0)
  const phase = usePhase()

  useScrollProgress((p) => {
    if (bar.current) bar.current.style.transform = `scaleX(${p})`
    const y = window.scrollY
    const down = y > lastY.current + 4
    const up = y < lastY.current - 4
    if (down && y > 300) setHidden(true)
    else if (up || y < 120) setHidden(false)
    lastY.current = y
  })

  // Active section highlight.
  useEffect(() => {
    const ids = ['home', 'about', 'services', 'why', 'approach', 'ecosystem', 'contact']
    const map: Record<string, string> = { approach: 'why', ecosystem: 'why' }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(map[e.target.id] ?? e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    lockScroll(open)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    // allow the overlay to start closing before scrolling
    window.setTimeout(() => scrollToSection(id), open ? 350 : 0)
  }

  const shown = phase !== 'loading'

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: shown && !hidden ? 0 : -110, opacity: shown ? 1 : 0 }}
        transition={{ duration: 0.9, ease: easeExpo, delay: shown && phase === 'intro' ? 1.1 : 0 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="absolute inset-x-0 top-0 h-[2px] bg-white/5">
          <div ref={bar} className="h-full origin-left scale-x-0 bg-accent" />
        </div>
        <nav className="wrap flex items-center justify-between py-5" aria-label="Primary">
          <button
            type="button"
            onClick={() => go('home')}
            className="group flex items-center gap-3"
            aria-label="K76 — back to top"
            data-cursor="Top"
          >
            <Logo className="h-7 w-auto transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-110 md:h-8" />
            <span className="hidden font-grotesk text-[0.65rem] uppercase leading-tight tracking-[0.25em] text-muted lg:block">
              Business
              <br />
              Solutions
            </span>
          </button>

          <ul className="hidden items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1.5 backdrop-blur-md md:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => go(item.id)}
                  className={`relative rounded-full px-5 py-2.5 font-grotesk text-[0.78rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
                    active === item.id ? 'text-white' : 'text-muted hover:text-white'
                  }`}
                  aria-current={active === item.id ? 'true' : undefined}
                >
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-accent shadow-[0_0_24px_-4px_rgba(255,21,56,0.8)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="relative z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/40 backdrop-blur md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 h-[2px] w-5 bg-white transition-all duration-500 ${open ? 'top-1.5 rotate-45' : 'top-0'}`}
              />
              <span
                className={`absolute left-0 h-[2px] bg-white transition-all duration-500 ${open ? 'top-1.5 w-5 -rotate-45' : 'top-3 w-3'}`}
              />
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="menu"
            variants={menuOverlay}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-[60] flex flex-col justify-between overflow-hidden bg-accent px-[var(--gutter)] pb-10 pt-28"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-10 font-display text-[60vw] leading-none text-black/10">
              76
            </div>
            <ul className="relative space-y-1">
              {navItems.map((item, i) => (
                <li key={item.id} className="overflow-hidden">
                  <motion.button
                    type="button"
                    variants={menuItem}
                    onClick={() => go(item.id)}
                    className="flex w-full items-baseline gap-4 text-left font-display text-[15vw] uppercase leading-[0.95] text-white"
                  >
                    <span className="font-grotesk text-xs tracking-[0.2em] text-black/50">0{i + 1}</span>
                    {item.label}
                  </motion.button>
                </li>
              ))}
            </ul>
            <motion.div variants={menuItem} className="relative space-y-5">
              <a
                href={whatsappLink('Hi K76, I would like to discuss a project.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 font-grotesk text-sm font-semibold uppercase tracking-[0.14em] text-white"
              >
                Let's Talk <ArrowUpRight className="h-4 w-4" />
              </a>
              <div className="flex items-center justify-between font-grotesk text-sm text-white">
                <a href={`mailto:${company.email}`}>{company.email}</a>
                <div className="flex gap-4">
                  {socials.map((s) => (
                    <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                      <SocialIcon k={s.key} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* desktop CTA floating at the right edge */}
      <div className="pointer-events-none fixed bottom-6 right-[var(--gutter)] z-40 hidden lg:block">
        <AnimatePresence>
          {shown && hidden && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.5, ease: easeExpo }}
              className="pointer-events-auto"
            >
              <MagneticButton onClick={() => go('contact')} variant="primary" cursor="Talk">
                Let's Talk <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

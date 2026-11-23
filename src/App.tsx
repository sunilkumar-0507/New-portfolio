import { Component, lazy, Suspense, useCallback, useEffect, type ReactNode } from 'react'
import { initSmoothScroll, lockScroll, ScrollTrigger } from './animations/gsapAnimations'
import { initSceneScroll, playSceneIntro } from './animations/scrollAnimations'
import { app, usePhase } from './lib/store'
import { useMousePosition } from './hooks/useMousePosition'
import { prefersReducedMotion } from './hooks/useMediaQuery'
import Loader from './components/Loader/Loader'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import CustomCursor from './components/CustomCursor/CustomCursor'
import Hero from './sections/Hero/Hero'
import About from './sections/About/About'
import Services from './sections/Services/Services'
import WhyK76 from './sections/WhyK76/WhyK76'
import Approach from './sections/Approach/Approach'
import Ecosystem from './sections/Ecosystem/Ecosystem'
import Contact from './sections/Contact/Contact'

// The whole Three.js / R3F stack is code-split into its own chunk.
const HeroScene = lazy(() => import('./scenes/HeroScene/HeroScene'))

/** If WebGL is unavailable, fall back to a static red glow instead of a blank page. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    app.markSceneReady()
  }
  render() {
    if (this.state.failed) {
      return (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0"
          style={{ background: 'radial-gradient(60% 50% at 50% 45%, rgba(255,21,56,0.22), transparent 70%), #050505' }}
        />
      )
    }
    return this.props.children
  }
}

export default function App() {
  useMousePosition()
  const phase = usePhase()

  // Smooth scroll + scroll-driven 3D keyframes.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const stopScroll = initSmoothScroll()
    lockScroll(true)
    const stopScene = initSceneScroll()
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => {
      stopScene()
      stopScroll()
      window.removeEventListener('load', refresh)
    }
  }, [])

  useEffect(() => {
    if (phase === 'intro') playSceneIntro(prefersReducedMotion())
  }, [phase])

  const onLoaded = useCallback(() => {
    lockScroll(false)
    app.setPhase('ready')
    ScrollTrigger.refresh()
  }, [])

  return (
    <div className="grain">
      <SceneBoundary>
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </SceneBoundary>

      <Loader onDone={onLoaded} />
      <CustomCursor />
      <Navbar />

      <main className="relative z-10">
        <Hero />
        <About />
        <Services />
        <WhyK76 />
        <Approach />
        <Ecosystem />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

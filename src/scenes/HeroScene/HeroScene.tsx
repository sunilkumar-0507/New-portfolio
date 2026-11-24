import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { Bloom, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'
import Typography3D from '../Typography3D/Typography3D'
import ParticleSystem from '../ParticleSystem/ParticleSystem'
import Shards from '../ParticleSystem/Shards'
import FloatingObjects from '../FloatingObjects/FloatingObjects'
import Background from './Background'
import Lighting from './Lighting'
import CameraRig from './CameraRig'
import { app, scroll } from '../../lib/store'
import { detectTier, downgrade, tierConfig, upgrade, type Tier } from '../../lib/quality'
import { prefersReducedMotion } from '../../hooks/useMediaQuery'

/** Tells the loader the GPU has actually rendered a couple of frames. */
function ReadySignal() {
  const frames = useRef(0)
  useFrame(() => {
    if (frames.current < 3 && ++frames.current === 3) app.markSceneReady()
  })
  return null
}

/** Pauses rendering while the canvas is scrolled away or the tab is hidden. */
function useVisibility() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])
  return visible
}

/**
 * On portrait (phone / tablet) layouts the copy sits directly over the 3D
 * stage, so once the visitor scrolls past the hero the stage fades to a softer
 * backdrop to keep text readable. Desktop keeps full intensity.
 */
function useMobileBackdropDim() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    let last = -1
    const tick = () => {
      const el = ref.current
      if (el) {
        const portrait = window.innerWidth < window.innerHeight && window.innerWidth < 1024
        const p = Math.min(1, Math.max(0, scroll.y / (window.innerHeight * 0.8)))
        const o = portrait ? 1 - 0.55 * p : 1
        if (Math.abs(o - last) > 0.005) {
          el.style.opacity = o.toFixed(3)
          last = o
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return ref
}

/**
 * The single, persistent WebGL stage rendered behind every section. Lazy-loaded
 * from App so the 3D stack lives in its own chunk.
 */
export default function HeroScene() {
  const [tier, setTier] = useState<Tier>(detectTier)
  const [reduced] = useState(prefersReducedMotion)
  const visible = useVisibility()
  const cfg = tierConfig[tier]
  const stage = useMobileBackdropDim()

  return (
    <div ref={stage} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={cfg.dpr}
        shadows={cfg.shadows}
        camera={{ position: [0, 0, 14], fov: 35, near: 0.1, far: 80 }}
        gl={{ antialias: tier !== 'low', alpha: false, powerPreference: 'high-performance', stencil: false }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
          gl.setClearColor('#050505')
        }}
      >
        <PerformanceMonitor
          flipflops={3}
          onDecline={() => setTier((t) => downgrade(t))}
          onIncline={() => setTier((t) => (t === detectTier() ? t : upgrade(t)))}
        />
        <Background reduced={reduced} />
        <Lighting shadows={cfg.shadows} />
        <CameraRig reduced={reduced} />
        <Typography3D reduced={reduced} shadows={cfg.shadows} />
        <FloatingObjects reduced={reduced} orbDetail={cfg.orbDetail} shadows={cfg.shadows} />
        <ParticleSystem key={`p-${cfg.particles}`} count={cfg.particles} reduced={reduced} />
        <Shards key={`s-${cfg.shards}`} count={cfg.shards} reduced={reduced} />
        <ReadySignal />
        {cfg.post && (
          <EffectComposer multisampling={tier === 'high' ? 4 : 0} enableNormalPass={false}>
            <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.2} intensity={0.75} radius={0.7} />
            <Vignette offset={0.25} darkness={0.75} />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}

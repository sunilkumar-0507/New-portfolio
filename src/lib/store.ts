// Mutable, non-React state shared between the DOM layer, GSAP and the WebGL scene.
// Everything here is read inside requestAnimationFrame / useFrame loops, so it
// deliberately lives outside React to avoid re-renders.

import { useSyncExternalStore } from 'react'

/* ---------------------------------------------------------------- pointer */
export const pointer = {
  /** normalised -1..1 (x right, y up) */
  x: 0,
  y: 0,
  /** raw client pixels */
  cx: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
  cy: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  down: false,
  active: false,
}

/* ----------------------------------------------------------------- scroll */
export const scroll = {
  y: 0,
  progress: 0,
  velocity: 0,
}

/* ------------------------------------------------------------ scene state */
// Keyframed by ScrollTrigger (see animations/scrollAnimations.ts) and damped
// toward inside the 3D components every frame.
export type TextState = { x: number; y: number; z: number; rx: number; ry: number; rz: number; s: number; spread: number; glow: number }
export type RingState = { x: number; y: number; z: number; rx: number; ry: number; s: number; spread: number }
export type BlobState = { x: number; y: number; z: number; s: number }
export type CamState = { y: number; z: number }
export type BgState = { glowX: number; glowY: number; intensity: number; hue: number }
export type ParticleState = { spread: number; swirl: number }

export type SceneKeyframe = {
  text: TextState
  rings: RingState
  blob: BlobState
  cam: CamState
  bg: BgState
  particles: ParticleState
}

export const sceneState: SceneKeyframe & { intro: number } = {
  intro: 0,
  text: { x: 0, y: 0.35, z: 0, rx: 0, ry: 0, rz: 0, s: 1, spread: 0, glow: 1 },
  rings: { x: 0, y: 0.35, z: -0.6, rx: 0.35, ry: 0, s: 1, spread: 0 },
  blob: { x: 3.2, y: 1.6, z: -3.5, s: 1 },
  cam: { y: 0, z: 10 },
  bg: { glowX: 0.5, glowY: 0.55, intensity: 1, hue: 0 },
  particles: { spread: 1, swirl: 0 },
}

/* ------------------------------------------------------------------ phase */
// loading → intro (hero entrance running) → ready
export type Phase = 'loading' | 'intro' | 'ready'

let phase: Phase = 'loading'
let sceneReady = false
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export const app = {
  getPhase: () => phase,
  setPhase(p: Phase) {
    if (p === phase) return
    phase = p
    emit()
  },
  isSceneReady: () => sceneReady,
  markSceneReady() {
    if (sceneReady) return
    sceneReady = true
    emit()
  },
  subscribe(l: () => void) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

export const usePhase = () => useSyncExternalStore(app.subscribe, app.getPhase, app.getPhase)
export const useSceneReady = () => useSyncExternalStore(app.subscribe, app.isSceneReady, app.isSceneReady)

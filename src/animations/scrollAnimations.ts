import { gsap } from './gsapAnimations'
import { sceneState, type SceneKeyframe } from '../lib/store'

/**
 * Scene keyframes — one per page section. As each section scrolls into view
 * the shared 3D state is scrubbed from the previous keyframe to this one, so
 * the K76 typography, rings, liquid orb, camera, background and particles
 * physically travel between sections and keep the page visually connected.
 *
 * x/y/z are in world units for a ~11-unit-wide desktop viewport; the scene
 * scales them down responsively on narrow screens.
 */
export const SCENE_KEYFRAMES: { id: string; state: SceneKeyframe }[] = [
  {
    id: 'home',
    state: {
      text: { x: 0, y: 0.35, z: 0, rx: 0, ry: 0, rz: 0, s: 1, spread: 0, glow: 1 },
      rings: { x: 0, y: 0.35, z: -0.6, rx: 0.35, ry: 0, s: 1, spread: 0 },
      blob: { x: 3.2, y: 1.6, z: -3.5, s: 1 },
      cam: { y: 0, z: 10 },
      bg: { glowX: 0.5, glowY: 0.55, intensity: 1, hue: 0 },
      particles: { spread: 1, swirl: 0 },
    },
  },
  {
    id: 'about',
    state: {
      text: { x: 3.5, y: 0.1, z: -1.8, rx: 0.15, ry: -0.7, rz: 0.06, s: 0.66, spread: 0, glow: 0.75 },
      rings: { x: 3.5, y: 0.1, z: -2.4, rx: 1.15, ry: 0.5, s: 0.85, spread: 0 },
      blob: { x: -5.4, y: 2.2, z: -5.5, s: 1.1 },
      cam: { y: -0.2, z: 10 },
      bg: { glowX: 0.78, glowY: 0.5, intensity: 0.75, hue: 0.1 },
      particles: { spread: 1.15, swirl: 0.7 },
    },
  },
  {
    id: 'services',
    state: {
      text: { x: 0, y: 0, z: -7.5, rx: -0.25, ry: 0.35, rz: 0, s: 1.75, spread: 0.65, glow: 0.3 },
      rings: { x: 0, y: 0, z: -5, rx: 1.45, ry: 0, s: 2.3, spread: 0 },
      blob: { x: 4.4, y: -2.3, z: -4, s: 0.9 },
      cam: { y: 0, z: 10 },
      bg: { glowX: 0.3, glowY: 0.4, intensity: 0.5, hue: 0.25 },
      particles: { spread: 1.4, swirl: 1.5 },
    },
  },
  {
    id: 'why',
    state: {
      text: { x: -3.3, y: -0.3, z: -1.3, rx: 0.1, ry: 0.75, rz: -0.08, s: 0.7, spread: 0, glow: 0.85 },
      rings: { x: -3.3, y: -0.3, z: -1.9, rx: 0.5, ry: -0.8, s: 0.9, spread: 0 },
      blob: { x: 4.6, y: 2.3, z: -5.2, s: 1 },
      cam: { y: 0, z: 10 },
      bg: { glowX: 0.2, glowY: 0.5, intensity: 0.85, hue: 0.1 },
      particles: { spread: 1.1, swirl: 2.1 },
    },
  },
  {
    id: 'approach',
    state: {
      text: { x: 0, y: -2.7, z: -2.2, rx: -1.15, ry: 0, rz: 0, s: 1.3, spread: 0.25, glow: 0.6 },
      rings: { x: 0, y: -2.1, z: -3, rx: 1.57, ry: 0, s: 1.7, spread: 0 },
      blob: { x: -5.6, y: -2.4, z: -6, s: 0.8 },
      cam: { y: 0.3, z: 10.5 },
      bg: { glowX: 0.5, glowY: 0.15, intensity: 0.9, hue: 0.2 },
      particles: { spread: 1.3, swirl: 2.9 },
    },
  },
  {
    id: 'ecosystem',
    state: {
      text: { x: 0, y: 3.4, z: -6, rx: 0.2, ry: 0, rz: 0, s: 0.5, spread: 0, glow: 0.65 },
      rings: { x: 0, y: -0.3, z: -2.2, rx: 0.2, ry: 0, s: 1, spread: 1 },
      blob: { x: 0, y: -1.7, z: -4, s: 0.5 },
      cam: { y: 0, z: 10 },
      bg: { glowX: 0.5, glowY: 0.5, intensity: 0.7, hue: 0.3 },
      particles: { spread: 1.2, swirl: 3.5 },
    },
  },
  {
    id: 'contact',
    state: {
      text: { x: 0, y: -0.2, z: -5, rx: -0.08, ry: 0, rz: 0, s: 1.3, spread: 0, glow: 0.8 },
      rings: { x: 0, y: -0.2, z: -5.6, rx: 0.35, ry: 0, s: 1.5, spread: 0 },
      blob: { x: -5.6, y: -2.2, z: -6, s: 1 },
      cam: { y: 0, z: 10 },
      bg: { glowX: 0.5, glowY: 0.62, intensity: 1.15, hue: 0 },
      particles: { spread: 0.9, swirl: 4.2 },
    },
  },
]

const KEYS: (keyof SceneKeyframe)[] = ['text', 'rings', 'blob', 'cam', 'bg', 'particles']

/** Creates one scrubbed ScrollTrigger per section transition. Returns a cleanup. */
export function initSceneScroll() {
  const ctx = gsap.context(() => {
    for (let i = 1; i < SCENE_KEYFRAMES.length; i++) {
      const prev = SCENE_KEYFRAMES[i - 1].state
      const next = SCENE_KEYFRAMES[i].state
      const tl = gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: {
          trigger: `#${SCENE_KEYFRAMES[i].id}`,
          start: 'top bottom',
          end: 'top 15%',
          scrub: 1.2,
        },
      })
      for (const key of KEYS) {
        tl.fromTo(sceneState[key], { ...prev[key] }, { ...next[key], immediateRender: false }, 0)
      }
    }
  })
  return () => ctx.revert()
}

/** Cinematic entrance of the 3D hero after the loader hands over. */
export function playSceneIntro(reduced: boolean) {
  if (reduced) {
    sceneState.intro = 1
    return
  }
  gsap.fromTo(sceneState, { intro: 0 }, { intro: 1, duration: 2.6, ease: 'power3.out' })
}

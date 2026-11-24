import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Center, Text3D } from '@react-three/drei'
import * as THREE from 'three'
import { useStageViewport } from '../../lib/viewport'
import type { FontData } from '@react-three/drei'
import fontJson from '../../assets/fonts/anton-k76.typeface.json'
import { pointer, sceneState } from '../../lib/store'

const font = fontJson as unknown as FontData

const LETTERS = ['K', '7', '6'] as const
const SIZE = 2.55
const DEPTH = 0.85
const GAP = 0.1
const ADV = LETTERS.map((ch) => ((fontJson.glyphs as Record<string, { ha: number }>)[ch].ha * SIZE) / 1000)
export const TEXT_WIDTH = ADV.reduce((a, b) => a + b, 0) + GAP * (LETTERS.length - 1)

// Centre x of each glyph slot, with the whole word centred on the origin.
const SLOT_X = (() => {
  let cursor = -TEXT_WIDTH / 2
  return ADV.map((w) => {
    const c = cursor + w / 2
    cursor += w + GAP
    return c
  })
})()

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
const easeOutBack = (t: number) => {
  const c1 = 1.4
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

type Props = { reduced: boolean; shadows: boolean }

/**
 * Giant extruded K76 letters in glossy brand-coloured metal. Each glyph is its own mesh so
 * the entrance, scroll "spread" and mouse tilt can be staggered per letter.
 */
export default function Typography3D({ reduced, shadows }: Props) {
  const group = useRef<THREE.Group>(null)
  const letters = useRef<(THREE.Group | null)[]>([])
  const { width: vw, height: vh } = useStageViewport()

  // One material per glyph, echoing the logo panels: lime K, pearl-white 7, violet 6.
  const materials = useMemo(() => {
    const make = (color: string, sheen: string, emissive: string, metalness: number, roughness: number) =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        metalness,
        roughness,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        reflectivity: 0.9,
        sheen: 0.45,
        sheenColor: new THREE.Color(sheen),
        emissive: new THREE.Color(emissive),
        emissiveIntensity: 0.35,
        envMapIntensity: 1.35,
      })
    return [
      make('#86ad2c', '#b9e05a', '#0d1402', 0.6, 0.24),
      make('#eeeef2', '#c9d6ff', '#101018', 0.35, 0.12),
      make('#8b3fd9', '#c79bff', '#22093d', 0.55, 0.16),
    ]
  }, [])
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials])

  // Fit to both width and height (glyphs are ~0.97×SIZE tall) so short screens aren't swamped.
  const fit = Math.min(1, (vw * 0.84) / TEXT_WIDTH, (vh * 0.42) / (SIZE * 0.97))
  const xFactor = Math.min(1, vw / 11)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const st = sceneState.text
    const intro = sceneState.intro
    const d = Math.min(delta, 1 / 30)
    const k = 1 - Math.pow(0.0025, d) // frame-rate independent damping

    const mx = reduced ? 0 : pointer.x
    const my = reduced ? 0 : pointer.y
    const float = reduced ? 0 : Math.sin(t * 0.8) * 0.07

    g.position.x += (st.x * xFactor - g.position.x) * k
    // Portrait screens stack the hero copy at the bottom — lift the type clear of it.
    const lift = vw < vh ? vh * 0.2 : 0
    g.position.y += (st.y + lift + float - g.position.y) * k
    g.position.z += (st.z - g.position.z) * k
    g.rotation.x += (st.rx - my * 0.22 - g.rotation.x) * k
    g.rotation.y += (st.ry + mx * 0.38 - g.rotation.y) * k
    g.rotation.z += (st.rz - g.rotation.z) * k
    const targetScale = st.s * fit
    g.scale.setScalar(g.scale.x + (targetScale - g.scale.x) * k)

    const pulse = 0.2 + st.glow * 0.3 + (reduced ? 0 : Math.sin(t * 1.6) * 0.05)
    for (const m of materials) m.emissiveIntensity = pulse

    // Per-letter entrance + spread.
    for (let i = 0; i < LETTERS.length; i++) {
      const l = letters.current[i]
      if (!l) continue
      const local = clamp01((intro - i * 0.11) / 0.67)
      const e = easeOutExpo(local)
      const b = easeOutBack(local)
      const offset = i - 1
      const spread = st.spread

      l.position.x = SLOT_X[i] * (1 + spread * 0.55)
      l.position.y = (1 - e) * (-2.6 + offset * 1.2) + spread * offset * 0.35 + (reduced ? 0 : Math.sin(t * 1.1 + i) * 0.04)
      l.position.z = (1 - e) * -16 + spread * Math.abs(offset) * -1.2
      l.rotation.x = (1 - e) * 1.1 + spread * offset * 0.25
      l.rotation.y = (1 - e) * (-Math.PI * 1.4 + offset * 0.6) + spread * offset * 0.5 + mx * 0.08 * offset
      l.rotation.z = (1 - e) * offset * 0.6
      l.scale.setScalar(Math.max(0.0001, b))
    }
  })

  return (
    <group ref={group}>
      {LETTERS.map((ch, i) => (
        <group key={ch} ref={(el) => void (letters.current[i] = el)}>
          <Center>
            <Text3D
              font={font}
              size={SIZE}
              height={DEPTH}
              curveSegments={10}
              bevelEnabled
              bevelThickness={0.06}
              bevelSize={0.035}
              bevelSegments={5}
              material={materials[i]}
              castShadow={shadows}
              receiveShadow={shadows}
            >
              {ch}
            </Text3D>
          </Center>
        </group>
      ))}
    </group>
  )
}

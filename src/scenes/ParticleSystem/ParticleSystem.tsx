import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { pointer, scroll, sceneState } from '../../lib/store'
import { particleFragment, particleVertex } from './shaders'

type Props = { count: number; reduced: boolean }

// Brand palette from the K76 logo.
const VIOLET = new THREE.Color('#9b55f0')
const COBALT = new THREE.Color('#2f6bff')
const LIME = new THREE.Color('#a6cf3f')
const WHITE = new THREE.Color('#ffffff')

/**
 * GPU-rendered point cloud (single draw call, custom GLSL) with a CPU spring
 * simulation: every particle is pulled toward a drifting "home", repelled by
 * the cursor, attracted (with swirl) while the pointer is pressed, smeared by
 * scroll velocity and orbited by the scroll-driven swirl.
 */
export default function ParticleSystem({ count, reduced }: Props) {
  const points = useRef<THREE.Points>(null)
  const camera = useThree((s) => s.camera)
  const dpr = useThree((s) => s.viewport.dpr)

  const data = useMemo(() => {
    const base = new Float32Array(count * 3)
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    const size = new Float32Array(count)
    const color = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      // Gaussian-ish distribution, denser toward the centre, pushed behind the camera plane.
      const g = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5
      const x = g() * 11
      const y = g() * 6.5
      const z = -1.5 + g() * 8 - Math.random() * 3
      base[i * 3] = x
      base[i * 3 + 1] = y
      base[i * 3 + 2] = Math.min(z, 4)
      // Start collapsed at the centre: the loader hands over a converged cluster.
      pos[i * 3] = (Math.random() - 0.5) * 0.3
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3
      const big = Math.random() < 0.06
      size[i] = big ? 2.2 + Math.random() * 2 : 0.55 + Math.random() * 1.1
      const r = Math.random()
      c.copy(r < 0.34 ? VIOLET : r < 0.6 ? COBALT : r < 0.82 ? LIME : WHITE)
      color[i * 3] = c.r
      color[i * 3 + 1] = c.g
      color[i * 3 + 2] = c.b
      seed[i] = Math.random()
    }
    return { base, pos, vel, size, color, seed }
  }, [count])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(data.pos, 3).setUsage(THREE.DynamicDrawUsage))
    geo.setAttribute('aSize', new THREE.BufferAttribute(data.size, 1))
    geo.setAttribute('aColor', new THREE.BufferAttribute(data.color, 3))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(data.seed, 1))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 40)
    return geo
  }, [data])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uSize: { value: 70 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  const ray = useMemo(() => ({ v: new THREE.Vector3(), dir: new THREE.Vector3() }), [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    material.uniforms.uTime.value = t
    material.uniforms.uPixelRatio.value = dpr

    const dt = Math.min(delta, 1 / 30) * 60 // normalise to 60fps steps
    const { base, pos, vel, seed } = data
    const intro = sceneState.intro
    const burst = 1 - Math.pow(1 - Math.min(1, intro * 1.25), 3)
    const spread = sceneState.particles.spread * burst
    const angle = sceneState.particles.swirl * 0.55 + (reduced ? 0 : t * 0.018)
    const ca = Math.cos(angle)
    const sa = Math.sin(angle)
    const drift = reduced ? 0 : 1
    const sv = reduced ? 0 : THREE.MathUtils.clamp(scroll.velocity, -60, 60) * 0.0009

    // Cursor ray (camera → pointer), intersected at each particle's depth.
    const interact = pointer.active && !reduced
    if (interact) {
      ray.v.set(pointer.x, pointer.y, 0.5).unproject(camera)
      ray.dir.copy(ray.v).sub(camera.position).normalize()
    }
    const cx = camera.position.x
    const cy = camera.position.y
    const cz = camera.position.z
    const R = 1.9
    const attract = pointer.down

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const s = seed[i]
      const bx = base[i3] * spread
      const by = base[i3 + 1] * spread
      const bz = base[i3 + 2] * spread
      const depth = 1 + (4 - bz) * 0.06
      const tx = bx * ca - bz * sa + Math.sin(t * 0.35 + s * 40) * 0.35 * drift * depth
      const ty = by + Math.cos(t * 0.28 + s * 23) * 0.3 * drift * depth
      const tz = bx * sa + bz * ca + Math.sin(t * 0.22 + s * 11) * 0.25 * drift

      let px = pos[i3]
      let py = pos[i3 + 1]
      let pz = pos[i3 + 2]
      let vx = vel[i3] + (tx - px) * 0.012 * dt
      let vy = vel[i3 + 1] + (ty - py) * 0.012 * dt - sv * depth * dt
      let vz = vel[i3 + 2] + (tz - pz) * 0.012 * dt

      if (interact && ray.dir.z !== 0) {
        const k = (pz - cz) / ray.dir.z
        const mx = cx + ray.dir.x * k
        const my = cy + ray.dir.y * k
        const dx = px - mx
        const dy = py - my
        const d2 = dx * dx + dy * dy
        const rr = attract ? R * 2.2 : R
        if (d2 < rr * rr && d2 > 0.0001) {
          const d = Math.sqrt(d2)
          const f = (1 - d / rr) * (1 - d / rr)
          if (attract) {
            // pull in + tangential swirl
            vx += (-dx / d * 0.09 - dy / d * 0.05) * f * dt
            vy += (-dy / d * 0.09 + dx / d * 0.05) * f * dt
          } else {
            vx += (dx / d) * f * 0.16 * dt
            vy += (dy / d) * f * 0.16 * dt
            vz += f * 0.05 * dt
          }
        }
      }

      const damp = Math.pow(0.9, dt)
      vx *= damp
      vy *= damp
      vz *= damp
      px += vx * dt
      py += vy * dt
      pz += vz * dt
      pos[i3] = px
      pos[i3 + 1] = py
      pos[i3 + 2] = pz
      vel[i3] = vx
      vel[i3 + 1] = vy
      vel[i3 + 2] = vz
    }
    ;(geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
  })

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
}

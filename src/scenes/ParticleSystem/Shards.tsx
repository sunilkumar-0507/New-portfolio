import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStageViewport } from '../../lib/viewport'
import { pointer, sceneState } from '../../lib/store'

type Props = { count: number; reduced: boolean }

/**
 * Instanced metallic shards (tetrahedra + octahedra) orbiting the scene. One
 * draw call per geometry; per-instance colour, spin and cursor avoidance.
 */
export default function Shards({ count, reduced }: Props) {
  const tetra = useRef<THREE.InstancedMesh>(null)
  const octa = useRef<THREE.InstancedMesh>(null)
  const { width: vw } = useStageViewport()

  const half = Math.ceil(count / 2)
  const items = useMemo(
    () =>
      Array.from({ length: half * 2 }, () => {
        const a = Math.random() * Math.PI * 2
        const r = 3.6 + Math.random() * 5.5
        return {
          x: Math.cos(a) * r * 1.2,
          y: (Math.random() - 0.5) * 7,
          z: -2 - Math.random() * 7 + Math.sin(a) * 1.5,
          s: 0.05 + Math.random() * 0.13,
          rs: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(1.6),
          phase: Math.random() * Math.PI * 2,
          ox: 0,
          oy: 0,
          red: Math.random() < 0.72,
        }
      }),
    [half],
  )

  const geoT = useMemo(() => new THREE.TetrahedronGeometry(1, 0), [])
  const geoO = useMemo(() => new THREE.OctahedronGeometry(1, 0), [])
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ metalness: 0.85, roughness: 0.22, flatShading: true, envMapIntensity: 1.6 }),
    [],
  )
  useEffect(
    () => () => {
      geoT.dispose()
      geoO.dispose()
      mat.dispose()
    },
    [geoT, geoO, mat],
  )

  useEffect(() => {
    const c = new THREE.Color()
    ;[tetra.current, octa.current].forEach((mesh, m) => {
      if (!mesh) return
      for (let i = 0; i < half; i++) {
        const it = items[m * half + i]
        mesh.setColorAt(i, c.set(it.red ? '#ff1538' : '#f2f2f2'))
      }
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    })
  }, [items, half])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const intro = Math.min(1, sceneState.intro * 1.1)
    const xf = Math.min(1, vw / 11)
    const swirl = sceneState.particles.swirl
    const meshes = [tetra.current, octa.current]
    for (let m = 0; m < 2; m++) {
      const mesh = meshes[m]
      if (!mesh) continue
      for (let i = 0; i < half; i++) {
        const it = items[m * half + i]
        const ang = swirl * 0.35
        const bx = it.x * Math.cos(ang) - it.z * Math.sin(ang) * 0.3
        let x = bx * xf * intro + (reduced ? 0 : Math.sin(t * 0.4 + it.phase) * 0.3)
        let y = it.y * intro + (reduced ? 0 : Math.cos(t * 0.5 + it.phase) * 0.35)
        const z = it.z
        // screen-space-ish cursor avoidance
        if (pointer.active && !reduced) {
          const px = pointer.x * (vw / 2) * (1 - z / 12)
          const py = pointer.y * 3.2 * (1 - z / 12)
          const dx = x - px
          const dy = y - py
          const d = Math.hypot(dx, dy)
          const push = d < 2 ? (1 - d / 2) * 1.1 : 0
          it.ox += ((d > 0 ? (dx / d) * push : 0) - it.ox) * 0.08
          it.oy += ((d > 0 ? (dy / d) * push : 0) - it.oy) * 0.08
        } else {
          it.ox *= 0.94
          it.oy *= 0.94
        }
        x += it.ox
        y += it.oy
        dummy.position.set(x, y, z)
        const spin = reduced ? 0 : t
        dummy.rotation.set(it.rs.x * spin + it.phase, it.rs.y * spin, it.rs.z * spin)
        dummy.scale.setScalar(it.s * Math.max(0.0001, intro))
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <>
      <instancedMesh ref={tetra} args={[geoT, mat, half]} frustumCulled={false} />
      <instancedMesh ref={octa} args={[geoO, mat, half]} frustumCulled={false} />
    </>
  )
}

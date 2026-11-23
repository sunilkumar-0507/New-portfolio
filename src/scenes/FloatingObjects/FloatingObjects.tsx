import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useStageViewport } from '../../lib/viewport'
import { pointer, sceneState } from '../../lib/store'
import { orbFragment, orbVertex } from './shaders'

type Props = { reduced: boolean; orbDetail: number; shadows: boolean }

const damp = (delta: number, lambda = 0.0025) => 1 - Math.pow(lambda, Math.min(delta, 1 / 30))

/* ------------------------------------------------------------------ rings */

// Triad positions used by the K76 Ecosystem section (three engines).
const TRIAD = [
  new THREE.Vector3(0, 2.0, 0),
  new THREE.Vector3(-3.4, -1.5, 0),
  new THREE.Vector3(3.4, -1.5, 0),
]

function Rings({ reduced, shadows }: { reduced: boolean; shadows: boolean }) {
  const group = useRef<THREE.Group>(null)
  const rings = useRef<(THREE.Mesh | null)[]>([])
  const { width: vw } = useStageViewport()

  const { geos, mats } = useMemo(() => {
    const geos = [
      new THREE.TorusGeometry(3.05, 0.045, 24, 220),
      new THREE.TorusGeometry(3.55, 0.018, 16, 220),
      new THREE.TorusGeometry(2.35, 0.09, 32, 200),
    ]
    const metal = new THREE.MeshPhysicalMaterial({
      color: '#ff1538',
      metalness: 0.9,
      roughness: 0.18,
      clearcoat: 1,
      envMapIntensity: 1.6,
    })
    const hot = new THREE.MeshStandardMaterial({
      color: '#ff2a4a',
      emissive: '#ff1538',
      emissiveIntensity: 2.2,
      toneMapped: false,
    })
    const chrome = new THREE.MeshPhysicalMaterial({ color: '#d9d9d9', metalness: 1, roughness: 0.08, envMapIntensity: 1.4 })
    return { geos, mats: [metal, hot, chrome] }
  }, [])
  useEffect(
    () => () => {
      geos.forEach((g) => g.dispose())
      mats.forEach((m) => m.dispose())
    },
    [geos, mats],
  )

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const st = sceneState.rings
    const k = damp(delta)
    const xf = Math.min(1, vw / 11)
    const intro = sceneState.intro
    const e = 1 - Math.pow(1 - Math.min(1, Math.max(0, (intro - 0.25) / 0.75)), 3)

    g.position.x += (st.x * xf - g.position.x) * k
    g.position.y += (st.y - g.position.y) * k
    g.position.z += (st.z - g.position.z) * k
    g.rotation.x += (st.rx * (1 - st.spread) - pointer.y * 0.15 - g.rotation.x) * k
    g.rotation.y += (st.ry * (1 - st.spread) + pointer.x * 0.25 - g.rotation.y) * k
    const sc = st.s * Math.max(0.0001, e) * Math.max(0.42, xf)
    g.scale.setScalar(g.scale.x + (sc - g.scale.x) * k)

    rings.current.forEach((m, i) => {
      if (!m) return
      const spin = reduced ? 0 : t
      const tri = TRIAD[i]
      // In triad mode each ring travels to a vertex of the triangle and faces the camera.
      const tx = tri.x * st.spread * (xf < 0.6 ? 0.42 : 1)
      const ty = tri.y * st.spread * (xf < 0.6 ? 1.25 : 1)
      m.position.x += (tx - m.position.x) * k
      m.position.y += (ty - m.position.y) * k
      const free = 1 - st.spread
      m.rotation.x = (i === 0 ? 1.3 : i === 1 ? 0.4 : -0.9) * free + spin * (0.12 + i * 0.07) * free
      m.rotation.y = (i === 2 ? 0.8 : 0) * free + spin * (0.2 - i * 0.05) * free
      m.rotation.z = spin * (0.15 + i * 0.1)
      const rs = 1 - st.spread * 0.62
      m.scale.setScalar(rs)
    })
  })

  return (
    <group ref={group}>
      {geos.map((geo, i) => (
        <mesh
          key={i}
          ref={(el) => void (rings.current[i] = el)}
          geometry={geo}
          material={mats[i === 1 ? 1 : i === 2 ? 2 : 0]}
          castShadow={shadows}
        />
      ))}
    </group>
  )
}

/* ------------------------------------------------- liquid orb + geo cage */

function LiquidOrb({ reduced, detail }: { reduced: boolean; detail: number }) {
  const group = useRef<THREE.Group>(null)
  const cage = useRef<THREE.LineSegments>(null)
  const inner = useRef<THREE.Mesh>(null)
  const { width: vw } = useStageViewport()
  const last = useRef({ x: 0, y: 0, speed: 0 })

  const geo = useMemo(() => new THREE.IcosahedronGeometry(1, detail), [detail])
  const cageGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.55, 1)), [])
  const octaGeo = useMemo(() => new THREE.OctahedronGeometry(0.32, 0), [])
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: orbVertex,
        fragmentShader: orbFragment,
        uniforms: {
          uTime: { value: 0 },
          uAmp: { value: 0.22 },
          uColorA: { value: new THREE.Color('#ff1538') },
          uColorB: { value: new THREE.Color('#1a0004') },
        },
      }),
    [],
  )
  const cageMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#ff1538', transparent: true, opacity: 0.38, depthWrite: false }),
    [],
  )
  const octaMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 1, roughness: 0.1 }), [])
  useEffect(
    () => () => {
      geo.dispose()
      cageGeo.dispose()
      octaGeo.dispose()
      mat.dispose()
      cageMat.dispose()
      octaMat.dispose()
    },
    [geo, cageGeo, octaGeo, mat, cageMat, octaMat],
  )

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const st = sceneState.blob
    const k = damp(delta)
    const xf = Math.min(1, vw / 11)

    // Pointer speed excites the liquid surface.
    const sp = Math.hypot(pointer.x - last.current.x, pointer.y - last.current.y) / Math.max(delta, 0.001)
    last.current.x = pointer.x
    last.current.y = pointer.y
    last.current.speed += (Math.min(sp, 6) - last.current.speed) * 0.06

    mat.uniforms.uTime.value = reduced ? 0 : t
    mat.uniforms.uAmp.value = 0.2 + (reduced ? 0 : last.current.speed * 0.05)

    const intro = Math.min(1, Math.max(0, (sceneState.intro - 0.35) / 0.65))
    g.position.x += (st.x * xf - g.position.x) * k
    g.position.y += (st.y + (reduced ? 0 : Math.sin(t * 0.6) * 0.15) - g.position.y) * k
    g.position.z += (st.z - g.position.z) * k
    const s = st.s * intro * Math.max(0.6, xf)
    g.scale.setScalar(g.scale.x + (s - g.scale.x) * k)

    if (cage.current && !reduced) {
      cage.current.rotation.x = t * 0.12 + pointer.y * 0.4
      cage.current.rotation.y = t * 0.18 + pointer.x * 0.6
    }
    if (inner.current && !reduced) {
      inner.current.position.set(Math.cos(t * 0.9) * 1.95, Math.sin(t * 1.3) * 0.6, Math.sin(t * 0.9) * 1.95)
      inner.current.rotation.set(t, t * 1.3, 0)
    }
  })

  return (
    <group ref={group} scale={0.0001}>
      <mesh geometry={geo} material={mat} />
      <lineSegments ref={cage} geometry={cageGeo} material={cageMat} />
      <mesh ref={inner} geometry={octaGeo} material={octaMat} position={[1.95, 0, 0]} />
    </group>
  )
}

/* -------------------------------------------------------- chrome spheres */

const SPHERES = [
  { p: [-4.6, 2.1, -1.5], r: 0.38, red: false },
  { p: [4.9, -2.0, -0.8], r: 0.5, red: true },
  { p: [-3.4, -2.6, 0.6], r: 0.22, red: false },
  { p: [2.6, 2.7, -2.2], r: 0.28, red: false },
  { p: [5.8, 1.2, -4.5], r: 0.7, red: false },
  { p: [-6.2, -0.4, -5], r: 0.9, red: true },
] as const

function Spheres({ reduced, shadows }: { reduced: boolean; shadows: boolean }) {
  const group = useRef<THREE.Group>(null)
  const { width: vw } = useStageViewport()
  const geo = useMemo(() => new THREE.SphereGeometry(1, 48, 48), [])
  const chrome = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#e8e8e8', metalness: 1, roughness: 0.04, envMapIntensity: 1.8 }),
    [],
  )
  const red = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#ff1538', metalness: 0.7, roughness: 0.12, clearcoat: 1, envMapIntensity: 1.5 }),
    [],
  )
  useEffect(
    () => () => {
      geo.dispose()
      chrome.dispose()
      red.dispose()
    },
    [geo, chrome, red],
  )

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    const k = damp(delta, 0.02)
    const intro = Math.min(1, Math.max(0, (sceneState.intro - 0.4) / 0.6))
    g.rotation.y += (sceneState.particles.swirl * 0.22 - g.rotation.y) * k
    g.position.x += (-pointer.x * 0.35 - g.position.x) * k
    g.position.y += (-pointer.y * 0.25 - g.position.y) * k
    const xf = Math.min(1, vw / 11)
    g.scale.setScalar(Math.max(0.0001, intro * Math.max(0.55, xf)))
  })

  return (
    <group ref={group}>
      {SPHERES.map((s, i) => (
        <Float key={i} speed={reduced ? 0 : 1.4} rotationIntensity={0.4} floatIntensity={reduced ? 0 : 1.2}>
          <mesh
            geometry={geo}
            material={s.red ? red : chrome}
            position={s.p as unknown as [number, number, number]}
            scale={s.r}
            castShadow={shadows}
          />
        </Float>
      ))}
    </group>
  )
}

export default function FloatingObjects({ reduced, orbDetail, shadows }: Props) {
  return (
    <>
      <Rings reduced={reduced} shadows={shadows} />
      <LiquidOrb reduced={reduced} detail={orbDetail} />
      <Spheres reduced={reduced} shadows={shadows} />
    </>
  )
}

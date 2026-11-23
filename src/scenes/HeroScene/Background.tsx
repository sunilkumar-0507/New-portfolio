import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { pointer, sceneState } from '../../lib/store'
import { bgFragment, bgVertex } from '../FloatingObjects/shaders'

/** Full-screen GLSL backdrop: drifting red nebula glow that moves between sections. */
export default function Background({ reduced }: { reduced: boolean }) {
  const size = useThree((s) => s.size)
  const geo = useMemo(() => new THREE.PlaneGeometry(2, 2), [])
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: bgVertex,
        fragmentShader: bgFragment,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uRes: { value: new THREE.Vector2(1, 1) },
          uGlow: { value: new THREE.Vector2(0.5, 0.55) },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uIntensity: { value: 0 },
          uHue: { value: 0 },
        },
      }),
    [],
  )
  useEffect(
    () => () => {
      geo.dispose()
      mat.dispose()
    },
    [geo, mat],
  )

  useFrame((state, delta) => {
    const u = mat.uniforms
    const k = 1 - Math.pow(0.02, Math.min(delta, 1 / 30))
    const bg = sceneState.bg
    u.uTime.value = reduced ? 0 : state.clock.elapsedTime
    u.uRes.value.set(size.width, size.height)
    u.uGlow.value.x += (bg.glowX - u.uGlow.value.x) * k
    u.uGlow.value.y += (bg.glowY - u.uGlow.value.y) * k
    u.uMouse.value.x += ((pointer.active ? pointer.x : 0) - u.uMouse.value.x) * k
    u.uMouse.value.y += ((pointer.active ? pointer.y : -2) - u.uMouse.value.y) * k
    u.uIntensity.value += (bg.intensity * Math.min(1, sceneState.intro * 1.6) - u.uIntensity.value) * k
    u.uHue.value += (bg.hue - u.uHue.value) * k
  })

  return <mesh geometry={geo} material={mat} frustumCulled={false} renderOrder={-1000} />
}

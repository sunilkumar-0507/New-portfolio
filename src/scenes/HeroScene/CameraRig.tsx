import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { pointer, scroll, sceneState } from '../../lib/store'

const target = new THREE.Vector3()

/** Mouse-parallax perspective camera that also follows the scroll keyframes. */
export default function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame((state, delta) => {
    const cam = state.camera
    const k = 1 - Math.pow(0.04, Math.min(delta, 1 / 30))
    const amp = reduced ? 0 : 1
    const intro = sceneState.intro
    // Dolly in during the intro for a cinematic push.
    const introZ = (1 - intro) * 4
    const sway = reduced ? 0 : THREE.MathUtils.clamp(scroll.velocity, -50, 50) * 0.002

    cam.position.x += (pointer.x * 0.75 * amp - cam.position.x) * k
    cam.position.y += (sceneState.cam.y + pointer.y * 0.45 * amp + sway - cam.position.y) * k
    cam.position.z += (sceneState.cam.z + introZ - cam.position.z) * k
    target.set(0, sceneState.cam.y * 0.4, 0)
    cam.lookAt(target)
  })
  return null
}

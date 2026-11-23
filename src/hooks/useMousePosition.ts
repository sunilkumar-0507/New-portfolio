import { useEffect } from 'react'
import { pointer } from '../lib/store'

let bound = 0

function onMove(e: PointerEvent) {
  pointer.cx = e.clientX
  pointer.cy = e.clientY
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1
  pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
  pointer.active = true
}
function onDown(e: PointerEvent) {
  onMove(e)
  pointer.down = true
}
function onUp() {
  pointer.down = false
  // Touch has no hover: let particles/camera relax back after a tap/drag.
  if (matchMedia('(pointer: coarse)').matches) pointer.active = false
}
function onLeave() {
  pointer.active = false
  pointer.down = false
}

/**
 * Installs a single set of global pointer listeners that write into the shared
 * `pointer` store. Returns that store — read it inside rAF / useFrame loops
 * instead of putting the mouse in React state (no re-renders).
 */
export function useMousePosition() {
  useEffect(() => {
    if (bound++ === 0) {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerdown', onDown, { passive: true })
      window.addEventListener('pointerup', onUp, { passive: true })
      window.addEventListener('pointercancel', onUp, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
    }
    return () => {
      if (--bound === 0) {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerdown', onDown)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onUp)
        document.documentElement.removeEventListener('pointerleave', onLeave)
      }
    }
  }, [])
  return pointer
}

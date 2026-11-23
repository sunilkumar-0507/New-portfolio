import { useThree } from '@react-three/fiber'

export const STAGE_FOV = 35
export const STAGE_DISTANCE = 10

/**
 * Visible world-space size of the z=0 plane when the camera rests at its
 * keyframed distance. R3F's `viewport` is measured from the camera's *current*
 * position, which is mid-dolly during the intro, so we derive it analytically.
 */
export function useStageViewport() {
  const size = useThree((s) => s.size)
  const height = 2 * STAGE_DISTANCE * Math.tan((STAGE_FOV * Math.PI) / 360)
  const width = height * (size.width / Math.max(1, size.height))
  return { width, height }
}

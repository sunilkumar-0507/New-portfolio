import { Environment, Lightformer } from '@react-three/drei'

/**
 * Cinematic lighting: a procedural studio environment (no HDR download) made of
 * violet, cobalt, lime and white light panels for glossy metal reflections, plus a key light,
 * violet / cobalt rim spotlights and a soft lime-white fill.
 */
export default function Lighting({ shadows }: { shadows: boolean }) {
  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight
        position={[-4, 6, 7]}
        intensity={2.2}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={1}
        shadow-camera-far={30}
      />
      <spotLight position={[7, 3, -3]} angle={0.6} penumbra={1} intensity={120} color="#8b3fd9" distance={30} />
      <spotLight position={[-7, -2, 2]} angle={0.7} penumbra={1} intensity={70} color="#1f5be0" distance={30} />
      <pointLight position={[0, -3, 6]} intensity={12} color="#f1f4ff" distance={20} />

      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#050505']} />
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 6, -4]} scale={[14, 2.2, 1]} rotation-x={Math.PI / 2.4} />
        <Lightformer form="rect" intensity={6} color="#8b3fd9" position={[-7, 0.5, 0]} scale={[12, 3, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={5} color="#1f5be0" position={[7, -0.5, -1]} scale={[12, 2, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={2.4} color="#ffffff" position={[3, 2, 8]} scale={2.5} />
        <Lightformer form="rect" intensity={1.4} color="#9bc23a" position={[0, -6, 2]} scale={[10, 1, 1]} rotation-x={-Math.PI / 2} />
      </Environment>
    </>
  )
}

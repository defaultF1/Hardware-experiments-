import { ContactShadows, Grid } from '@react-three/drei'

export function SceneLights() {
  return (
    <>
      <hemisphereLight args={['#fff6e8', '#cfc3ac', 1.1]} />
      <directionalLight position={[320, 640, -420]} intensity={1.7} />
      <directionalLight position={[-420, 300, 520]} intensity={0.55} />
      <directionalLight position={[0, 200, 800]} intensity={0.25} />
    </>
  )
}

export function Floor({ y, size = 3000, shadowResolution = 512 }: { y: number; size?: number; shadowResolution?: number }) {
  return (
    <group position-y={y}>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.6}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#EAE2D3" roughness={1} metalness={0} />
      </mesh>
      <Grid
        position-y={-0.2}
        args={[size, size]}
        cellSize={10}
        cellThickness={0.7}
        cellColor="#DBD1BD"
        sectionSize={50}
        sectionThickness={1.1}
        sectionColor="#C4B59A"
        fadeDistance={1500}
        fadeStrength={1.4}
        infiniteGrid
      />
      <ContactShadows position-y={0.2} opacity={0.42} scale={760} blur={2.4} far={170} resolution={shadowResolution} color="#2A2420" frames={Infinity} />
    </group>
  )
}

import { RoundedBox } from '@react-three/drei'
import type { Component } from '../../catalog/schema'
import { Decor } from './Decor'
import { Mat, safeRadius } from './Mat'
import { useFaceTexture } from './ScreenFace'

export function PartBody({ component, highlight = 0 }: { component: Component; highlight?: number }) {
  const b = component.body
  const size = b.size
  return (
    <group>
      {b.shape === 'box' && (
        <RoundedBox args={size} radius={safeRadius(size, b.radius ?? 1)} smoothness={3}>
          <Mat color={b.color} highlight={highlight} />
        </RoundedBox>
      )}
      {b.shape === 'pcb' && (
        <RoundedBox args={size} radius={safeRadius(size, 0.6)} smoothness={2}>
          <Mat color={b.color} highlight={highlight} roughness={0.7} />
        </RoundedBox>
      )}
      {b.shape === 'cylinder' && (
        <mesh>
          <cylinderGeometry args={[size[0] / 2, size[0] / 2, size[1], 40]} />
          <Mat color={b.color} highlight={highlight} />
        </mesh>
      )}
      {b.shape === 'wheel' && <WheelBody width={size[0]} diameter={size[1]} color={b.color} highlight={highlight} />}
      {b.shape === 'display' && <DisplayBody size={size} color={b.color} highlight={highlight} />}
      <Decor items={b.decor} highlight={highlight} />
    </group>
  )
}

function WheelBody({ width, diameter, color, highlight }: { width: number; diameter: number; color: string; highlight: number }) {
  const r = diameter / 2
  return (
    <group rotation-z={-Math.PI / 2}>
      <mesh>
        <cylinderGeometry args={[r, r, width, 56]} />
        <Mat color={color} highlight={highlight} roughness={0.85} />
      </mesh>
      {/* the vinyl tape that fixed turning */}
      <mesh>
        <cylinderGeometry args={[r + 0.4, r + 0.4, width * 0.38, 56]} />
        <Mat color="#E8E0D0" highlight={highlight} roughness={0.5} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[r * 0.5, r * 0.5, width + 1.6, 36]} />
        <Mat color="#EFE4CF" highlight={highlight} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} rotation-y={(i * Math.PI * 2) / 5}>
          <boxGeometry args={[r * 1.7, width * 0.5, 7]} />
          <Mat color="#EFE4CF" highlight={highlight} />
        </mesh>
      ))}
      <mesh position-y={width / 2 + 1}>
        <cylinderGeometry args={[6, 6, 2.5, 24]} />
        <Mat color="#1B1917" highlight={highlight} />
      </mesh>
    </group>
  )
}

function DisplayBody({ size, color, highlight }: { size: [number, number, number]; color: string; highlight: number }) {
  const texture = useFaceTexture('idle')
  const [w, h, d] = size
  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={3} smoothness={3}>
        <Mat color={color} highlight={highlight} roughness={0.4} />
      </RoundedBox>
      <mesh position-z={-d / 2 - 0.15} rotation-y={Math.PI}>
        <planeGeometry args={[w - 14, h - 13]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}

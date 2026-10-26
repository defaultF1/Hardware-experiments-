import { RoundedBox } from '@react-three/drei'
import type { Decor as DecorItem } from '../../catalog/schema'
import { Mat, axisRotation, deg, safeRadius } from './Mat'

export function Decor({ items, highlight }: { items: DecorItem[]; highlight: number }) {
  return (
    <>
      {items.map((d, i) => {
        if (d.type === 'box') {
          return (
            <RoundedBox key={i} args={d.size} radius={safeRadius(d.size, d.radius ?? 0.4)} smoothness={2} position={d.pos} rotation={d.rot ? deg(d.rot) : undefined}>
              <Mat color={d.color} highlight={highlight} />
            </RoundedBox>
          )
        }
        if (d.type === 'cyl') {
          return (
            <mesh key={i} position={d.pos} rotation={axisRotation(d.axis)}>
              <cylinderGeometry args={[d.radius, d.radius, d.length, 28]} />
              <Mat color={d.color} highlight={highlight} />
            </mesh>
          )
        }
        return (
          <mesh key={i} position={d.pos}>
            <sphereGeometry args={[d.radius, 20, 16]} />
            <Mat color={d.color} highlight={highlight} />
          </mesh>
        )
      })}
    </>
  )
}

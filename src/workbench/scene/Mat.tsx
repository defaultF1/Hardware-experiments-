/** Shared material look for procedural parts: matte plastic / PCB with an optional accent glow. */
export function Mat({ color, highlight = 0, roughness = 0.55, metalness = 0.05 }: { color: string; highlight?: number; roughness?: number; metalness?: number }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      emissive="#B5542D"
      emissiveIntensity={highlight}
    />
  )
}

export const deg = (v: [number, number, number]): [number, number, number] => [
  (v[0] * Math.PI) / 180,
  (v[1] * Math.PI) / 180,
  (v[2] * Math.PI) / 180,
]

export function axisRotation(axis: 'x' | 'y' | 'z'): [number, number, number] {
  if (axis === 'x') return [0, 0, Math.PI / 2]
  if (axis === 'z') return [Math.PI / 2, 0, 0]
  return [0, 0, 0]
}

export function safeRadius(size: [number, number, number], wanted: number) {
  const min = Math.min(...size)
  return Math.max(0.01, Math.min(wanted, min / 2 - 0.02))
}

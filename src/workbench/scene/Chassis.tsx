import { useMemo, type RefObject } from 'react'
import { Shape, ExtrudeGeometry } from 'three'
import type { Group } from 'three'
import type { ChassisPiece } from '../../chassis/generate'
import type { Tier } from '../../designs/types'
import { Mat, axisRotation } from './Mat'

export type TierRefs = Record<Exclude<Tier, 'free'>, RefObject<Group | null>>

export function Chassis({ pieces, tierRefs, highlight = 0 }: { pieces: ChassisPiece[]; tierRefs: TierRefs; highlight?: number }) {
  const byTier = useMemo(() => {
    const m: Record<string, ChassisPiece[]> = { base: [], tier2: [], head: [] }
    for (const p of pieces) (m[p.tier] ??= []).push(p)
    return m
  }, [pieces])
  return (
    <>
      {(['base', 'tier2', 'head'] as const).map((tier) => (
        <group key={tier} ref={tierRefs[tier]} name={`chassis:${tier}`}>
          {byTier[tier].map((p) => (
            <Piece key={p.id} piece={p} highlight={highlight} />
          ))}
        </group>
      ))}
    </>
  )
}

function Piece({ piece, highlight }: { piece: ChassisPiece; highlight: number }) {
  if (piece.kind === 'plate') return <Plate piece={piece} highlight={highlight} />
  if (piece.kind === 'post') {
    return (
      <mesh position={piece.position} rotation={axisRotation(piece.axis)}>
        <cylinderGeometry args={[piece.radius, piece.radius, piece.length, 16]} />
        <Mat color={piece.color} highlight={highlight} metalness={0.5} roughness={0.35} />
      </mesh>
    )
  }
  return (
    <mesh position={piece.position}>
      <boxGeometry args={piece.size} />
      <Mat color={piece.color} highlight={highlight} roughness={0.75} />
    </mesh>
  )
}

function Plate({ piece, highlight }: { piece: Extract<ChassisPiece, { kind: 'plate' }>; highlight: number }) {
  const geometry = useMemo(() => {
    const [w, l] = piece.size
    const r = Math.min(piece.radius, w / 2 - 1, l / 2 - 1)
    const s = new Shape()
    const x = -w / 2, y = -l / 2
    s.moveTo(x + r, y)
    s.lineTo(x + w - r, y)
    s.quadraticCurveTo(x + w, y, x + w, y + r)
    s.lineTo(x + w, y + l - r)
    s.quadraticCurveTo(x + w, y + l, x + w - r, y + l)
    s.lineTo(x + r, y + l)
    s.quadraticCurveTo(x, y + l, x, y + l - r)
    s.lineTo(x, y + r)
    s.quadraticCurveTo(x, y, x + r, y)
    const g = new ExtrudeGeometry(s, { depth: piece.thickness, bevelEnabled: false, curveSegments: 10 })
    // extrude goes along +z; lay the plate flat (shape plane → xz, thickness → +y)
    g.rotateX(-Math.PI / 2)
    g.computeVertexNormals()
    return g
  }, [piece.size, piece.radius, piece.thickness])
  return (
    <mesh geometry={geometry} position={piece.position}>
      <Mat color={piece.color} highlight={highlight} roughness={0.8} />
    </mesh>
  )
}

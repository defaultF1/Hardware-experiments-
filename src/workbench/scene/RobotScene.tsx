import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useCursor } from '@react-three/drei'
import { easing } from 'maath'
import type { Group } from 'three'
import type { Build, Placement } from '../../designs/types'
import { catalog } from '../../catalog'
import { generateChassis } from '../../chassis/generate'
import { useLab } from '../../designs/store'
import { Chassis, type TierRefs } from './Chassis'
import { PartBody } from './PartBody'
import { TIER_LIFT, explodeOffset } from './explode'
import { deg } from './Mat'

export function RobotScene({ build, interactive = true, spin = false }: { build: Build; interactive?: boolean; spin?: boolean }) {
  const root = useRef<Group>(null)
  const tierRefs: TierRefs = { base: useRef<Group>(null), tier2: useRef<Group>(null), head: useRef<Group>(null) }
  const partRefs = useRef(new Map<string, Group>())
  const explodeNow = useRef({ v: 0 })
  const lifts = useRef(new Map<string, number>())
  const pieces = useMemo(() => generateChassis(build.chassis.params), [build.chassis.params])

  useFrame((_, dt) => {
    const { explode, reduceMotion, hoverId, selectedId } = useLab.getState()
    const step = Math.min(dt, 0.05)
    if (reduceMotion) explodeNow.current.v = explode
    else easing.damp(explodeNow.current, 'v', explode, 0.22, step)
    const f = explodeNow.current.v

    for (const tier of ['base', 'tier2', 'head'] as const) {
      const g = tierRefs[tier].current
      if (g) g.position.y = TIER_LIFT[tier] * f
    }
    for (const p of build.placements) {
      const g = partRefs.current.get(p.instanceId)
      if (!g) continue
      const off = explodeOffset(p.tier, f, p.explodeDir)
      const want = interactive && (hoverId === p.instanceId || selectedId === p.instanceId) ? 1.5 : 0
      const cur = lifts.current.get(p.instanceId) ?? 0
      const lift = reduceMotion ? want : cur + (want - cur) * Math.min(1, step * 14)
      lifts.current.set(p.instanceId, lift)
      g.position.set(p.position[0] + off[0], p.position[1] + off[1] + lift, p.position[2] + off[2])
    }
    if (spin && root.current) root.current.rotation.y += step * 0.35
  })

  return (
    <group ref={root} name="robot">
      <Chassis pieces={pieces} tierRefs={tierRefs} />
      {build.placements.map((p) => (
        <PartInstance key={p.instanceId} placement={p} interactive={interactive} register={(g) => (g ? partRefs.current.set(p.instanceId, g) : partRefs.current.delete(p.instanceId))} />
      ))}
    </group>
  )
}

function PartInstance({ placement: p, interactive, register }: { placement: Placement; interactive: boolean; register: (g: Group | null) => void }) {
  const component = catalog[p.componentId]
  const hovered = useLab((s) => s.hoverId === p.instanceId)
  const selected = useLab((s) => s.selectedId === p.instanceId)
  const setHover = useLab((s) => s.setHover)
  const setSelected = useLab((s) => s.setSelected)
  const requestFocus = useLab((s) => s.requestFocus)
  useCursor(interactive && hovered)
  if (!component) return null
  const highlight = interactive ? (selected ? 0.24 : hovered ? 0.14 : 0) : 0
  const labelY = component.body.size[1] / 2 + 14

  return (
    <group
      ref={register}
      name={`part:${p.instanceId}`}
      position={p.position}
      onPointerOver={interactive ? (e) => { e.stopPropagation(); setHover(p.instanceId) } : undefined}
      onPointerOut={interactive ? () => setHover(null) : undefined}
      onClick={interactive ? (e) => { e.stopPropagation(); setSelected(selected ? null : p.instanceId) } : undefined}
      onDoubleClick={interactive ? (e) => { e.stopPropagation(); requestFocus(p.instanceId) } : undefined}
    >
      <group rotation={deg(p.rotation)} scale={p.mirrored ? [-1, 1, 1] : [1, 1, 1]}>
        <PartBody component={component} highlight={highlight} />
      </group>
      {interactive && (hovered || selected) && (
        <Html position={[0, labelY, 0]} center zIndexRange={[25, 20]} style={{ pointerEvents: 'none' }}>
          <div className="whitespace-nowrap rounded-full border border-line-strong bg-bg-elev/95 px-3 py-1 text-[12px] font-medium text-ink shadow-float">
            {p.label ?? component.shortName ?? component.name}
            <span className="ml-2 font-mono text-[11px] text-ink-3">{component.body.size.map((n) => Math.round(n)).join('×')} mm</span>
          </div>
        </Html>
      )}
    </group>
  )
}

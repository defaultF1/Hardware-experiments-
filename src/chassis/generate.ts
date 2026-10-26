import type { ChassisParams, Tier } from '../designs/types'
import type { Vec3 } from '../catalog/schema'

export type ChassisPiece =
  | { id: string; kind: 'plate'; tier: Tier; size: [number, number]; thickness: number; radius: number; position: Vec3; color: string }
  | { id: string; kind: 'post'; tier: Tier; radius: number; length: number; axis: 'x' | 'y' | 'z'; position: Vec3; color: string }
  | { id: string; kind: 'block'; tier: Tier; size: Vec3; position: Vec3; color: string }

const BRASS = '#C8A24A'

/** Pure geometry description of the parametric three-tier SARAS chassis. Base plate top surface is y = 0. */
export function generateChassis(p: ChassisParams): ChassisPiece[] {
  const pieces: ChassisPiece[] = []
  const hw = p.widthMm / 2
  const hl = p.lengthMm / 2
  const t = p.plateMm
  const tier2Y = p.tierGapMm // bottom of tier-2 plate
  const trayY = tier2Y + t + p.neckMm // bottom of head tray
  const dark = shade(p.color, -0.18)

  pieces.push({ id: 'plate-base', kind: 'plate', tier: 'base', size: [p.widthMm, p.lengthMm], thickness: t, radius: p.cornerRadiusMm, position: [0, -t, 0], color: p.color })
  pieces.push({ id: 'plate-tier2', kind: 'plate', tier: 'tier2', size: [p.widthMm, p.lengthMm], thickness: t, radius: p.cornerRadiusMm, position: [0, tier2Y, 0], color: p.color })

  // standoff posts between base and tier 2, inset from the corners
  const inset = 10
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    pieces.push({
      id: `post-${sx < 0 ? 'l' : 'r'}${sz < 0 ? 'f' : 'r'}`,
      kind: 'post', tier: 'tier2', radius: 2.5, length: p.tierGapMm, axis: 'y',
      position: [sx * (hw - inset), tier2Y / 2, sz * (hl - inset)], color: BRASS,
    })
  }
  // Pi mounting standoffs (58 × 49 mm pattern, rotated with the Pi: 49 along x, 58 along z)
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    pieces.push({ id: `pi-post-${sx}${sz}`, kind: 'post', tier: 'tier2', radius: 2.2, length: 4, axis: 'y', position: [sx * 24.5, tier2Y + t + 2, sz * 29], color: BRASS })
  }

  // motor brackets: two brass standoffs per motor from the plate edge out to the motor (the clearance fix)
  const motorZ = p.wheelbaseMm / 2 - 24
  const motorY = -t - 11
  for (const sx of [-1, 1] as const) {
    for (const [sz, z] of [[-1, -motorZ], [1, motorZ]] as const) {
      for (const dz of [-9, 9]) {
        pieces.push({
          id: `bracket-${sx}${sz}${dz}`, kind: 'post', tier: 'base', radius: 2.5, length: p.motorOutboardMm, axis: 'x',
          position: [sx * (hw + p.motorOutboardMm / 2), motorY + 4, z + dz], color: BRASS,
        })
      }
    }
  }

  // sensor brackets on the base plate rim
  pieces.push({ id: 'bracket-us-front', kind: 'block', tier: 'base', size: [50, 22, 4], position: [0, 11, -hl + 2], color: dark })
  pieces.push({ id: 'bracket-us-left', kind: 'block', tier: 'base', size: [4, 22, 24], position: [-hw + 2, 11, -40], color: dark })
  pieces.push({ id: 'bracket-us-right', kind: 'block', tier: 'base', size: [4, 22, 24], position: [hw - 2, 11, -40], color: dark })

  // neck blocks (speaker holders) and head tray
  const neckZ = -10
  pieces.push({ id: 'neck-l', kind: 'block', tier: 'head', size: [26, p.neckMm, 40], position: [-(hw - 13), tier2Y + t + p.neckMm / 2, neckZ], color: dark })
  pieces.push({ id: 'neck-r', kind: 'block', tier: 'head', size: [26, p.neckMm, 40], position: [hw - 13, tier2Y + t + p.neckMm / 2, neckZ], color: dark })
  pieces.push({ id: 'plate-head', kind: 'plate', tier: 'head', size: [p.widthMm, p.headTrayLengthMm], thickness: t, radius: p.cornerRadiusMm, position: [0, trayY, -25 + p.headTrayLengthMm / 2], color: p.color })
  // display frame feet
  pieces.push({ id: 'frame-l', kind: 'block', tier: 'head', size: [8, 30, 16], position: [-70, trayY + t + 15, -30], color: dark })
  pieces.push({ id: 'frame-r', kind: 'block', tier: 'head', size: [8, 30, 16], position: [70, trayY + t + 15, -30], color: dark })

  return pieces
}

/** y of the floor: wheels touch it */
export function floorY(p: ChassisParams): number {
  const motorY = -p.plateMm - 11
  return motorY - p.wheelDiameterMm / 2
}

export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount)))
  return `#${[f(r), f(g), f(b)].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

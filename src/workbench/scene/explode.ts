import type { Tier } from '../../designs/types'
import type { Vec3 } from '../../catalog/schema'

export const TIER_LIFT: Record<Tier, number> = { base: 0, tier2: 70, head: 150, free: 0 }
const PART_LIFT = 22

/** Offset applied to a part at explode factor f (0..1). Tier lift + a small lift off its plate + any custom direction. */
export function explodeOffset(tier: Tier, f: number, explodeDir?: Vec3, isChassis = false): Vec3 {
  const lift = TIER_LIFT[tier] * f
  if (isChassis) return [0, lift, 0]
  const d = explodeDir ?? [0, 0, 0]
  return [d[0] * f, lift + PART_LIFT * f + d[1] * f, d[2] * f]
}

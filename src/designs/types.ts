import type { Vec3 } from '../catalog/schema'

export type Tier = 'base' | 'tier2' | 'head' | 'free'

export interface ChassisParams {
  lengthMm: number
  widthMm: number
  tierGapMm: number
  plateMm: number
  cornerRadiusMm: number
  /** how far the motors are pushed out from the plate edge (the standoff fix) */
  motorOutboardMm: number
  wheelbaseMm: number
  wheelDiameterMm: number
  neckMm: number
  headTrayLengthMm: number
  standoffGridMm: 5 | 10
  color: string
}

export interface Placement {
  instanceId: string
  componentId: string
  label?: string
  tier: Tier
  position: Vec3
  /** degrees */
  rotation: Vec3
  mirrored?: boolean
  /** mm of extra travel at full explode, in addition to the tier lift */
  explodeDir?: Vec3
}

export interface Build {
  schemaVersion: 1
  chassis: { mode: 'parametric'; params: ChassisParams }
  placements: Placement[]
  connections: never[]
  assumptions: Record<string, string>
}

export interface Design {
  id: string
  name: string
  versionLabel: string
  note: string
  build: Build
  createdAt: string
  updatedAt: string
}

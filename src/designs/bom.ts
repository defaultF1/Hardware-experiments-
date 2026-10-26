import type { Component } from '../catalog/schema'
import type { Build } from './types'

export interface BomLine {
  componentId: string
  name: string
  qty: number
  unitUsd: number
  unitInr: number
  totalUsd: number
  totalInr: number
  massG: number
  assumed: boolean
}

export interface Bom {
  lines: BomLine[]
  totalUsd: number
  totalInr: number
  totalMassG: number
  partCount: number
}

export function computeBom(build: Build, catalog: Record<string, Component>): Bom {
  const counts = new Map<string, number>()
  for (const p of build.placements) counts.set(p.componentId, (counts.get(p.componentId) ?? 0) + 1)
  const lines: BomLine[] = []
  for (const [componentId, qty] of counts) {
    const c = catalog[componentId]
    if (!c) continue
    const unitUsd = c.price?.usd ?? 0
    const unitInr = c.price?.inr ?? 0
    lines.push({
      componentId,
      name: c.shortName ?? c.name,
      qty,
      unitUsd,
      unitInr,
      totalUsd: unitUsd * qty,
      totalInr: unitInr * qty,
      massG: (c.massG ?? 0) * qty,
      assumed: c.assumed,
    })
  }
  lines.sort((a, b) => b.totalUsd - a.totalUsd)
  return {
    lines,
    totalUsd: lines.reduce((s, l) => s + l.totalUsd, 0),
    totalInr: lines.reduce((s, l) => s + l.totalInr, 0),
    totalMassG: lines.reduce((s, l) => s + l.massG, 0),
    partCount: build.placements.length,
  }
}

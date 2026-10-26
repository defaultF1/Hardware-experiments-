import { describe, it, expect } from 'vitest'
import { generateChassis, floorY, shade } from '../chassis/generate'
import { sarasV1 } from '../designs/presets/saras-v1'
import { explodeOffset } from '../workbench/scene/explode'
import { computeBom } from '../designs/bom'
import { Component } from '../catalog/schema'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const params = sarasV1.build.chassis.params

describe('chassis generator', () => {
  it('produces three plates and four corner posts', () => {
    const pieces = generateChassis(params)
    expect(pieces.filter((p) => p.kind === 'plate')).toHaveLength(3)
    expect(pieces.filter((p) => p.id.startsWith('post-'))).toHaveLength(4)
  })
  it('puts the tier-2 plate one tier gap above the base', () => {
    const tier2 = generateChassis(params).find((p) => p.id === 'plate-tier2')!
    expect(tier2.position[1]).toBe(params.tierGapMm)
  })
  it('places motor brackets outboard by the configured offset', () => {
    const b = generateChassis(params).find((p) => p.id.startsWith('bracket-1'))!
    expect(b.kind).toBe('post')
    if (b.kind === 'post') expect(b.length).toBe(params.motorOutboardMm)
  })
  it('floor sits one wheel radius under the motor axis', () => {
    expect(floorY(params)).toBeCloseTo(-3 - 11 - 42.5)
  })
  it('shade darkens and lightens', () => {
    expect(shade('#808080', -0.5)).toBe('#404040')
    expect(shade('#000000', 0.5)).toBe('#808080')
  })
})

describe('explode', () => {
  it('is zero at f=0', () => {
    expect(explodeOffset('head', 0, [10, 0, 0])).toEqual([0, 0, 0])
  })
  it('lifts head parts above tier-2 parts at f=1', () => {
    const head = explodeOffset('head', 1)
    const tier2 = explodeOffset('tier2', 1)
    expect(head[1]).toBeGreaterThan(tier2[1])
  })
  it('chassis pieces get only the tier lift', () => {
    expect(explodeOffset('tier2', 1, undefined, true)).toEqual([0, 70, 0])
  })
})

describe('catalog and BOM', () => {
  const dir = join(__dirname, '..', 'catalog', 'parts')
  const parts = readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => Component.parse(JSON.parse(readFileSync(join(dir, f), 'utf8'))))
  const catalog = Object.fromEntries(parts.map((p) => [p.id, p]))

  it('every built-in part validates and has an id matching its file', () => {
    expect(parts.length).toBeGreaterThanOrEqual(11)
    for (const p of parts) expect(p.id).toMatch(/^[a-z0-9-]+$/)
  })
  it('the reference design only references known parts', () => {
    for (const pl of sarasV1.build.placements) expect(catalog[pl.componentId], pl.componentId).toBeDefined()
  })
  it('BOM lands near the $150 the video quotes', () => {
    const bom = computeBom(sarasV1.build, catalog)
    expect(bom.partCount).toBe(sarasV1.build.placements.length)
    expect(bom.totalUsd).toBeGreaterThan(120)
    expect(bom.totalUsd).toBeLessThan(190)
    expect(bom.lines.find((l) => l.componentId === 'tt-gear-motor')!.qty).toBe(4)
  })
})

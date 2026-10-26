import { Component } from './schema'

const files = import.meta.glob('./parts/*.json', { eager: true, import: 'default' }) as Record<string, unknown>

const parsed: Component[] = Object.entries(files)
  .map(([path, raw]) => {
    const result = Component.safeParse(raw)
    if (!result.success) {
      console.error(`Catalog part ${path} is invalid`, result.error.issues)
      return null
    }
    return result.data
  })
  .filter((c): c is Component => c !== null)
  .sort((a, b) => a.name.localeCompare(b.name))

export const catalog: Record<string, Component> = Object.fromEntries(parsed.map((c) => [c.id, c]))
export const catalogList: Component[] = parsed

export function getComponent(id: string): Component {
  const c = catalog[id]
  if (!c) throw new Error(`Unknown component "${id}"`)
  return c
}

export const CATEGORY_LABEL: Record<Component['category'], string> = {
  compute: 'Compute',
  'motor-driver': 'Motor driver',
  motor: 'Motor',
  wheel: 'Wheel',
  sensor: 'Sensor',
  camera: 'Camera',
  display: 'Display',
  audio: 'Audio',
  power: 'Power',
  regulator: 'Regulator',
  mechanical: 'Mechanical',
  wiring: 'Wiring',
  misc: 'Misc',
}

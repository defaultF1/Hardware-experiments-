import { create } from 'zustand'
import type { Design } from './types'
import { sarasV1 } from './presets/saras-v1'

export type ViewPreset = 'iso' | 'top' | 'front' | 'side'
export type CameraRequest =
  | { nonce: number; kind: 'view'; view: ViewPreset }
  | { nonce: number; kind: 'focus'; instanceId: string }
  | { nonce: number; kind: 'reset' }

interface LabState {
  design: Design
  designs: Design[]
  explode: number
  hoverId: string | null
  selectedId: string | null
  autoOrbit: boolean
  reduceMotion: boolean
  cameraRequest: CameraRequest | null
  paletteOpen: boolean
  quality: 'low' | 'medium' | 'high'

  setExplode: (v: number) => void
  toggleExplode: () => void
  setHover: (id: string | null) => void
  setSelected: (id: string | null) => void
  setAutoOrbit: (v: boolean) => void
  setReduceMotion: (v: boolean) => void
  requestView: (view: ViewPreset) => void
  requestFocus: (instanceId: string) => void
  requestReset: () => void
  setPaletteOpen: (v: boolean) => void
  setQuality: (q: LabState['quality']) => void
}

let nonce = 0

export const useLab = create<LabState>()((set, get) => ({
  design: sarasV1,
  designs: [sarasV1],
  explode: 0,
  hoverId: null,
  selectedId: null,
  autoOrbit: true,
  reduceMotion: false,
  cameraRequest: null,
  paletteOpen: false,
  quality: 'high',

  setExplode: (v) => set({ explode: Math.min(1, Math.max(0, v)) }),
  toggleExplode: () => set({ explode: get().explode > 0.5 ? 0 : 1 }),
  setHover: (id) => set((s) => (s.hoverId === id ? s : { hoverId: id })),
  setSelected: (id) => set({ selectedId: id }),
  setAutoOrbit: (v) => set({ autoOrbit: v }),
  setReduceMotion: (v) => set({ reduceMotion: v, autoOrbit: v ? false : get().autoOrbit }),
  requestView: (view) => set({ cameraRequest: { nonce: ++nonce, kind: 'view', view } }),
  requestFocus: (instanceId) => set({ cameraRequest: { nonce: ++nonce, kind: 'focus', instanceId }, selectedId: instanceId }),
  requestReset: () => set({ cameraRequest: { nonce: ++nonce, kind: 'reset' } }),
  setPaletteOpen: (v) => set({ paletteOpen: v }),
  setQuality: (quality) => set({ quality }),
}))

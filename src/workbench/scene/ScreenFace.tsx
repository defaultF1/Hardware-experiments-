import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CanvasTexture, SRGBColorSpace } from 'three'

export type FaceState = 'idle' | 'listening' | 'thinking' | 'talking'

/**
 * SARAS's face as a live canvas texture on the 3D display. Idle for now; it blinks.
 * Test mode (M5) will drive listening / thinking / talking from events.
 */
export function useFaceTexture(state: FaceState = 'idle') {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 320
    return c
  }, [])
  const texture = useMemo(() => {
    const t = new CanvasTexture(canvas)
    t.colorSpace = SRGBColorSpace
    t.anisotropy = 4
    return t
  }, [canvas])
  const blink = useRef({ next: 2 + Math.random() * 3, t: 0, phase: 0, mouth: 0 })
  const last = useRef<string>('')

  const draw = (eyeOpen: number, mouth: number) => {
    const ctx = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height
    ctx.fillStyle = '#131211'
    ctx.fillRect(0, 0, W, H)
    const eyeW = 96, eyeH = 118 * Math.max(0.06, eyeOpen), r = 30
    const cy = H * 0.42
    for (const cx of [W * 0.32, W * 0.68]) {
      ctx.fillStyle = state === 'listening' ? '#9fd3d8' : '#F4EFE6'
      roundRect(ctx, cx - eyeW / 2, cy - eyeH / 2, eyeW, eyeH, Math.min(r, eyeH / 2))
      ctx.fill()
    }
    // mouth
    const mw = 120 + mouth * 40, mh = 10 + mouth * 34
    ctx.fillStyle = '#B5542D'
    roundRect(ctx, W / 2 - mw / 2, H * 0.74 - mh / 2, mw, mh, mh / 2)
    ctx.fill()
    texture.needsUpdate = true
  }

  useEffect(() => {
    draw(1, 0)
    last.current = 'open'
  }, [state])

  useFrame((_, dt) => {
    const b = blink.current
    b.t += dt
    let open = 1
    if (b.t > b.next) {
      b.phase += dt
      const d = 0.16
      open = b.phase < d / 2 ? 1 - (b.phase / (d / 2)) : Math.min(1, (b.phase - d / 2) / (d / 2))
      if (b.phase >= d) {
        b.t = 0
        b.phase = 0
        b.next = 2.5 + Math.random() * 3.5
        open = 1
      }
    }
    let mouth = 0
    if (state === 'talking') mouth = (Math.sin(performance.now() / 90) + 1) / 2
    const key = `${open.toFixed(2)}:${mouth.toFixed(2)}`
    if (key !== last.current) {
      last.current = key
      draw(open, mouth)
    }
  })

  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

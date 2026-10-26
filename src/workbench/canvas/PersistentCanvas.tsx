import type { RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { View } from './TypedView'
import { useLab } from '../../designs/store'

/**
 * One WebGL context for the whole app. Pages place <View> elements wherever 3D should
 * appear; drei tiles the canvas into those rectangles. The canvas is fixed, transparent
 * and ignores pointer events: the View elements receive input and forward it.
 */
export function PersistentCanvas({ eventSource }: { eventSource: RefObject<HTMLDivElement | null> }) {
  const quality = useLab((s) => s.quality)
  return (
    <Canvas
      className="lab-canvas"
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix="client"
      dpr={quality === 'low' ? 1 : [1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false }}
      frameloop="always"
      flat={false}
    >
      <View.Port />
    </Canvas>
  )
}

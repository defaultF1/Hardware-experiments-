import { useRef, type ReactNode } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import { View } from './TypedView'
import type { Build } from '../../designs/types'
import { floorY } from '../../chassis/generate'
import { RobotScene } from '../scene/RobotScene'
import { Floor, SceneLights } from '../scene/Environment'
import { CameraRig, ThumbnailCamera } from '../controls/CameraRig'
import { useLab } from '../../designs/store'

interface ViewportProps {
  build: Build
  mode?: 'interactive' | 'thumbnail'
  className?: string
  overlay?: ReactNode
  background?: string
  label?: string
}

/**
 * A rectangle of the page that the persistent canvas renders into.
 * Interactive: orbit / pan / zoom with mouse, trackpad, touch, keyboard; hover and select parts.
 * Thumbnail: fixed camera, the robot slowly spins, no input.
 */
export function Viewport({ build, mode = 'interactive', className = '', overlay, background = '#EAE2D3', label = '3D view of the design' }: ViewportProps) {
  const viewRef = useRef<HTMLDivElement>(null)
  const orbit = useLab((s) => s.autoOrbit)
  const floor = floorY(build.chassis.params)
  const interactive = mode === 'interactive'

  return (
    <div className={`relative ${className}`}>
      <View
        ref={viewRef}
        className="lab-view absolute inset-0 h-full w-full"
        tabIndex={interactive ? 0 : -1}
        role={interactive ? 'application' : 'img'}
        aria-label={interactive ? `${label}. Drag to rotate, scroll to zoom, arrow keys to orbit.` : label}
      >
        <color attach="background" args={[background]} />
        <PerspectiveCamera makeDefault fov={32} near={5} far={9000} position={[-300, 320, -520]} />
        {interactive ? <CameraRig viewRef={viewRef} orbit={orbit} /> : <ThumbnailCamera />}
        <SceneLights />
        <Floor y={floor} shadowResolution={interactive ? 512 : 256} />
        <RobotScene build={build} interactive={interactive} spin={!interactive} />
      </View>
      {overlay && <div className="lab-overlay inset-0">{overlay}</div>}
    </div>
  )
}

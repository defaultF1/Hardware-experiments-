import { useEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import type CameraControlsImpl from 'camera-controls'
import { Box3, Sphere, Vector3 } from 'three'
import { useLab, type ViewPreset } from '../../designs/store'

/** azimuth (around y, from +z) and polar (from +y) in radians. The robot faces -z. */
export const VIEWS: Record<ViewPreset, { az: number; pol: number }> = {
  iso: { az: Math.PI + 0.62, pol: 1.02 },
  top: { az: Math.PI, pol: 0.02 },
  front: { az: Math.PI, pol: 1.32 },
  side: { az: Math.PI / 2, pol: 1.32 },
}

const ORBIT_RESUME_MS = 20000
const ORBIT_SPEED = 0.11 // rad/s ≈ 6°/s

export function CameraRig({ viewRef, orbit }: { viewRef: RefObject<HTMLDivElement | null>; orbit: boolean }) {
  const controls = useRef<CameraControlsImpl>(null)
  const scene = useThree((s) => s.scene)
  const cameraRequest = useLab((s) => s.cameraRequest)
  const reduceMotion = useLab((s) => s.reduceMotion)
  const idleSince = useRef(performance.now())
  const touched = useRef(false)
  const fitted = useRef(false)

  const robotSphere = () => {
    const g = scene.getObjectByName('robot')
    if (!g) return null
    const s = new Box3().setFromObject(g).getBoundingSphere(new Sphere())
    s.radius *= 1.12
    return s
  }

  const fitAll = (transition: boolean) => {
    const c = controls.current
    const s = robotSphere()
    if (!c || !s) return
    c.rotateTo(VIEWS.iso.az, VIEWS.iso.pol, transition)
    c.fitToSphere(s, transition)
  }

  useEffect(() => {
    const c = controls.current
    if (!c) return
    c.smoothTime = 0.45
    c.draggingSmoothTime = 0.09
    c.minDistance = 120
    c.maxDistance = 3500
    c.maxPolarAngle = Math.PI / 2 + 0.08
    c.minPolarAngle = 0.02
    c.dollySpeed = 0.9
    c.truckSpeed = 1.6
  }, [])

  // fit once the robot exists
  useFrame(() => {
    if (fitted.current) return
    const s = robotSphere()
    if (!s || s.radius < 1) return
    fitted.current = true
    const c = controls.current!
    c.setLookAt(-300, 320, -520, s.center.x, s.center.y, s.center.z, false)
    c.rotateTo(VIEWS.iso.az, VIEWS.iso.pol, false)
    c.fitToSphere(s, false)
  })

  // camera requests from the UI (view presets, focus, reset)
  useEffect(() => {
    const c = controls.current
    if (!c || !cameraRequest) return
    const t = !reduceMotion
    if (cameraRequest.kind === 'view') {
      const v = VIEWS[cameraRequest.view]
      c.rotateTo(v.az, v.pol, t)
    } else if (cameraRequest.kind === 'focus') {
      const obj = scene.getObjectByName(`part:${cameraRequest.instanceId}`)
      if (obj) {
        const s = new Box3().setFromObject(obj).getBoundingSphere(new Sphere())
        s.radius = Math.max(s.radius * 1.6, 70)
        c.fitToSphere(s, t)
      }
    } else {
      fitAll(t)
    }
    idleSince.current = performance.now()
    touched.current = true
  }, [cameraRequest])

  // keyboard
  useEffect(() => {
    const el = viewRef.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      const c = controls.current
      if (!c) return
      const t = !useLab.getState().reduceMotion
      const { requestView, requestFocus, selectedId, toggleExplode, setAutoOrbit, autoOrbit } = useLab.getState()
      const rot = 0.14
      switch (e.key) {
        case 'ArrowLeft': if (e.shiftKey) c.truck(-20, 0, t); else c.rotate(rot, 0, t); break
        case 'ArrowRight': if (e.shiftKey) c.truck(20, 0, t); else c.rotate(-rot, 0, t); break
        case 'ArrowUp': if (e.shiftKey) c.truck(0, -20, t); else c.rotate(0, -rot * 0.6, t); break
        case 'ArrowDown': if (e.shiftKey) c.truck(0, 20, t); else c.rotate(0, rot * 0.6, t); break
        case '+': case '=': c.dolly(70, t); break
        case '-': case '_': c.dolly(-70, t); break
        case 'Home': case '0': fitAll(t); break
        case '1': requestView('iso'); break
        case '2': requestView('top'); break
        case '3': requestView('front'); break
        case '4': requestView('side'); break
        case 'f': case 'F': if (selectedId) requestFocus(selectedId); else fitAll(t); break
        case 'e': case 'E': toggleExplode(); break
        case 'o': case 'O': setAutoOrbit(!autoOrbit); break
        default: return
      }
      e.preventDefault()
      idleSince.current = performance.now()
      touched.current = true
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [viewRef.current])

  useFrame((_, dt) => {
    const c = controls.current
    if (!c || !orbit || useLab.getState().reduceMotion) return
    const idle = performance.now() - idleSince.current
    if (!touched.current || idle > ORBIT_RESUME_MS) c.azimuthAngle += Math.min(dt, 0.05) * ORBIT_SPEED
  })

  return (
    <CameraControls
      ref={controls}
      makeDefault
      onControlStart={() => {
        idleSince.current = performance.now()
        touched.current = true
      }}
    />
  )
}

/** Fixed camera for thumbnails: frames the robot from the iso direction for the view's aspect. */
export function ThumbnailCamera({ target = new Vector3(0, 95, 0), radius = 215 }: { target?: Vector3; radius?: number }) {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  useEffect(() => {
    const v = VIEWS.iso
    const aspect = size.width / Math.max(1, size.height)
    const vfov = (('fov' in camera ? (camera as { fov: number }).fov : 35) * Math.PI) / 180
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect)
    const dist = radius / Math.sin(Math.min(vfov, hfov) / 2)
    const dir = new Vector3(Math.sin(v.pol) * Math.sin(v.az), Math.cos(v.pol), Math.sin(v.pol) * Math.cos(v.az))
    camera.position.copy(target).addScaledVector(dir, dist)
    camera.lookAt(target)
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height, target, radius])
  return null
}

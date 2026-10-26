import { useEffect, useMemo, useRef } from 'react'
import { PerspectiveCamera, CameraControls, ContactShadows } from '@react-three/drei'
import { View } from './TypedView'
import { useFrame } from '@react-three/fiber'
import type CameraControlsImpl from 'camera-controls'
import { Group, Vector3, Sphere } from 'three'
import type { Component } from '../../catalog/schema'
import { PartBody } from '../scene/PartBody'
import { SceneLights } from '../scene/Environment'
import { ThumbnailCamera } from '../controls/CameraRig'

/** A single part on its own: spinning thumbnail on cards, orbitable on the detail page. */
export function PartViewport({ component, interactive = false, className = '', spin = true }: { component: Component; interactive?: boolean; className?: string; spin?: boolean }) {
  const [sx, sy, sz] = component.body.size
  const radius = Math.sqrt(sx * sx + sy * sy + sz * sz) / 2
  const target = useMemo(() => new Vector3(0, 0, 0), [])
  return (
    <View className={`lab-view ${className}`} role="img" aria-label={`3D model of ${component.name}`} tabIndex={interactive ? 0 : -1}>
      <color attach="background" args={['#EAE2D3']} />
      <PerspectiveCamera makeDefault fov={30} near={1} far={4000} position={[radius * 2, radius * 1.6, -radius * 2.4]} />
      {interactive ? <PartOrbit radius={radius} /> : <ThumbnailCamera target={target} radius={radius * 1.15} />}
      <SceneLights />
      <Spinner spin={spin && !interactive}>
        <PartBody component={component} />
      </Spinner>
      <ContactShadows position-y={-sy / 2 - 0.5} opacity={0.35} scale={radius * 5} blur={2.5} far={radius * 1.5} resolution={256} color="#2A2420" frames={Infinity} />
    </View>
  )
}

function Spinner({ spin, children }: { spin: boolean; children: React.ReactNode }) {
  const ref = useRef<Group>(null)
  useFrame((_, dt) => {
    if (spin && ref.current) ref.current.rotation.y += Math.min(dt, 0.05) * 0.5
  })
  return <group ref={ref} rotation-y={0.6}>{children}</group>
}

function PartOrbit({ radius }: { radius: number }) {
  const ref = useRef<CameraControlsImpl>(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    c.smoothTime = 0.4
    c.draggingSmoothTime = 0.09
    c.minDistance = radius * 1.2
    c.maxDistance = radius * 12
    c.fitToSphere(new Sphere(new Vector3(0, 0, 0), radius * 1.15), false)
    c.rotateTo(Math.PI + 0.7, 1.05, false)
  }, [radius])
  return <CameraControls ref={ref} makeDefault />
}

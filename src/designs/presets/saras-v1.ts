import type { Design, Placement } from '../types'

const MOTOR_Y = -14
const MOTOR_X = 96
const WHEEL_X = 120
const WHEEL_Z = 60

const placements: Placement[] = [
  { instanceId: 'power-bank', componentId: 'power-bank-5v', label: '5 V power bank (Pi rail)', tier: 'base', position: [0, 7.5, -55], rotation: [0, 0, 0] },
  { instanceId: 'driver', componentId: 'l298n-module', label: 'L298N motor driver', tier: 'base', position: [0, 3.8, 5], rotation: [0, 0, 0] },
  { instanceId: 'battery-2s', componentId: 'battery-holder-2s', label: '18650 ×2 (motor rail)', tier: 'base', position: [0, 10, 55], rotation: [0, 0, 0] },

  { instanceId: 'motor-fr', componentId: 'tt-gear-motor', label: 'Motor front-right', tier: 'base', position: [MOTOR_X, MOTOR_Y, -36], rotation: [0, 0, 0], explodeDir: [18, 0, 0] },
  { instanceId: 'motor-rr', componentId: 'tt-gear-motor', label: 'Motor rear-right', tier: 'base', position: [MOTOR_X, MOTOR_Y, 36], rotation: [0, 180, 0], mirrored: true, explodeDir: [18, 0, 0] },
  { instanceId: 'motor-fl', componentId: 'tt-gear-motor', label: 'Motor front-left', tier: 'base', position: [-MOTOR_X, MOTOR_Y, -36], rotation: [0, 0, 0], mirrored: true, explodeDir: [-18, 0, 0] },
  { instanceId: 'motor-rl', componentId: 'tt-gear-motor', label: 'Motor rear-left', tier: 'base', position: [-MOTOR_X, MOTOR_Y, 36], rotation: [0, 180, 0], explodeDir: [-18, 0, 0] },

  { instanceId: 'wheel-fr', componentId: 'wheel-85', label: 'Wheel front-right', tier: 'base', position: [WHEEL_X, MOTOR_Y, -WHEEL_Z], rotation: [0, 0, 0], explodeDir: [55, 0, 0] },
  { instanceId: 'wheel-rr', componentId: 'wheel-85', label: 'Wheel rear-right', tier: 'base', position: [WHEEL_X, MOTOR_Y, WHEEL_Z], rotation: [0, 0, 0], explodeDir: [55, 0, 0] },
  { instanceId: 'wheel-fl', componentId: 'wheel-85', label: 'Wheel front-left', tier: 'base', position: [-WHEEL_X, MOTOR_Y, -WHEEL_Z], rotation: [0, 0, 0], mirrored: true, explodeDir: [-55, 0, 0] },
  { instanceId: 'wheel-rl', componentId: 'wheel-85', label: 'Wheel rear-left', tier: 'base', position: [-WHEEL_X, MOTOR_Y, WHEEL_Z], rotation: [0, 0, 0], mirrored: true, explodeDir: [-55, 0, 0] },

  { instanceId: 'us-front', componentId: 'hc-sr04', label: 'Ultrasonic front', tier: 'base', position: [0, 12, -106], rotation: [0, 0, 0], explodeDir: [0, 0, -40] },
  { instanceId: 'us-left', componentId: 'hc-sr04', label: 'Ultrasonic left', tier: 'base', position: [-76, 12, -40], rotation: [0, 90, 0], explodeDir: [-40, 0, 0] },
  { instanceId: 'us-right', componentId: 'hc-sr04', label: 'Ultrasonic right', tier: 'base', position: [76, 12, -40], rotation: [0, -90, 0], explodeDir: [40, 0, 0] },

  { instanceId: 'pi', componentId: 'raspberry-pi-4b', label: 'Raspberry Pi 4B', tier: 'tier2', position: [0, 48.8 + 4, 0], rotation: [0, -90, 0] },

  { instanceId: 'display', componentId: 'display-7in', label: '7" display (face)', tier: 'head', position: [0, 144.5, -30], rotation: [8, 0, 0], explodeDir: [0, 10, -40] },
  { instanceId: 'camera', componentId: 'pi-camera-v2', label: 'Pi Camera', tier: 'head', position: [0, 211, -23.5], rotation: [8, 0, 0], explodeDir: [0, 40, -10] },
  { instanceId: 'speaker', componentId: 'usb-speaker', label: 'USB speaker', tier: 'head', position: [-25, 108.5, 5], rotation: [0, 0, 0] },
  { instanceId: 'mic', componentId: 'usb-mic', label: 'USB microphone', tier: 'head', position: [35, 106, 50], rotation: [0, 0, 0] },
]

export const sarasV1: Design = {
  id: 'saras-v1',
  name: 'SARAS v1',
  versionLabel: 'v1 · reference',
  note: 'The build from the videos: Pi on a 5 V bank, motors on 18650s, 85 mm wheels, three HC-SR04s.',
  createdAt: '2026-10-26T00:00:00.000Z',
  updatedAt: '2026-10-26T00:00:00.000Z',
  build: {
    schemaVersion: 1,
    chassis: {
      mode: 'parametric',
      params: {
        lengthMm: 210,
        widthMm: 150,
        tierGapMm: 45,
        plateMm: 3,
        cornerRadiusMm: 14,
        motorOutboardMm: 12,
        wheelbaseMm: 120,
        wheelDiameterMm: 85,
        neckMm: 40,
        headTrayLengthMm: 110,
        standoffGridMm: 5,
        color: '#8D8780',
      },
    },
    placements,
    connections: [],
    assumptions: {
      piModel: 'Raspberry Pi 4 Model B',
      wheelDiameter: '85 mm',
      display: 'Generic 7" 1024×600 HDMI, USB-powered',
    },
  },
}

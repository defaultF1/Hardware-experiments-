import { z } from 'zod'

/** Scene axes: x = robot right, y = up, z = robot back (front faces -z). Units mm, g, V, A, USD. */
export const Vec3 = z.tuple([z.number(), z.number(), z.number()])
export type Vec3 = z.infer<typeof Vec3>

export const Category = z.enum([
  'compute', 'motor-driver', 'motor', 'wheel', 'sensor', 'camera', 'display', 'audio',
  'power', 'regulator', 'mechanical', 'wiring', 'misc',
])
export type Category = z.infer<typeof Category>

export const Role = z.enum(['brain', 'driver', 'drive', 'sense', 'see', 'hear', 'speak', 'face', 'power', 'structure'])

/** A decorative primitive drawn relative to the body centre (procedural detail). */
export const Decor = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('box'),
    size: Vec3,
    pos: Vec3,
    color: z.string(),
    rot: Vec3.optional(),
    radius: z.number().optional(),
  }),
  z.object({
    type: z.literal('cyl'),
    radius: z.number(),
    length: z.number(),
    axis: z.enum(['x', 'y', 'z']).default('y'),
    pos: Vec3,
    color: z.string(),
  }),
  z.object({
    type: z.literal('sphere'),
    radius: z.number(),
    pos: Vec3,
    color: z.string(),
  }),
])
export type Decor = z.infer<typeof Decor>

export const Body = z.object({
  /** box: rounded block · pcb: thin board · cylinder: axis y · wheel: axis x · display: bezel + live screen · group: decor only */
  shape: z.enum(['box', 'pcb', 'cylinder', 'wheel', 'display', 'group']),
  /** envelope [x, y, z] in mm (wheel: [width, diameter, diameter]) */
  size: Vec3,
  color: z.string().default('#8A7F74'),
  radius: z.number().optional(),
  decor: z.array(Decor).default([]),
  model: z.string().optional(),
})
export type Body = z.infer<typeof Body>

export const PowerSpec = z.object({
  supplyV: z.object({ min: z.number(), max: z.number() }).optional(),
  typicalA: z.number().optional(),
  maxA: z.number().optional(),
  providesV: z.number().optional(),
  providesMaxA: z.number().optional(),
  capacityWh: z.number().optional(),
})

export const Component = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  shortName: z.string().optional(),
  category: Category,
  role: Role.optional(),
  body: Body,
  massG: z.number().optional(),
  power: PowerSpec.optional(),
  price: z.object({ usd: z.number().optional(), inr: z.number().optional(), updated: z.string(), url: z.string().optional() }).optional(),
  tags: z.array(z.string()).default([]),
  gotchas: z.array(z.string()).default([]),
  summary: z.string().optional(),
  assumed: z.boolean().default(false),
  source: z.enum(['builtin', 'user']).default('builtin'),
  version: z.literal(1).default(1),
})
export type Component = z.infer<typeof Component>

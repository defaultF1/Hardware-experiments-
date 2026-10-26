import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from 'react'
import { View as DreiView } from '@react-three/drei'

type ViewProps = Parameters<typeof DreiView>[0]

/** drei's View spreads unknown props onto its DOM element at runtime but does not type them; this does. */
export const View = DreiView as unknown as ForwardRefExoticComponent<ViewProps & HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>> & { Port: typeof DreiView.Port }

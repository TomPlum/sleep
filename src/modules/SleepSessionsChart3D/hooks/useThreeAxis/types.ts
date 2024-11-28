import { MutableRefObject } from 'react'
import { ForceGraph3DInstance } from '3d-force-graph'

export interface ThreeAxisProps {
  graphRef: MutableRefObject<ForceGraph3DInstance | undefined>
}
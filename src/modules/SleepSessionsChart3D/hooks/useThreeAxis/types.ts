import { MutableRefObject } from 'react'
import { ForceGraphMethods } from 'modules/SleepSessionsChart3D/types'

export interface ThreeAxisProps {
  graphRef: MutableRefObject<ForceGraphMethods | undefined>
}
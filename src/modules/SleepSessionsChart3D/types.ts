import { SleepMetric } from 'modules/ChartControls'

export interface LinkConfig {
  /**
   * The ID of the source node
   * that the link comes from.
   */
  source: string

  /**
   * The ID of the target node
   * that the link is going to.
   */
  target: string

  /**
   * The value of the node. This varies
   * depending on the type of node, but
   * it's used to drive other attributes.
   */
  value: number

  /**
   * Whether the link should render a
   * directional arrow-head at the
   * target node.
   */
  showDirectionalArrow?: boolean
}

export interface NodeConfig {
  id?: string | number
  x?: number
  y?: number
  z?: number
  vx?: number
  vy?: number
  vz?: number
  fx?: number
  fy?: number
  fz?: number
  metric?: SleepMetric
  date?: string
  source?: string
  quality: number
}
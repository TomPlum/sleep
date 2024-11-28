import { SleepMetric } from 'modules/ChartControls'

export interface LinkConfig {
  source: string
  target: string
  value: number
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
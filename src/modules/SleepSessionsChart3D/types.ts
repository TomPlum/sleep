import { Camera, Renderer, Scene } from 'three'
import PostProcessing from 'three/src/renderers/common/PostProcessing'
import { SleepMetric } from 'modules/ChartControls'

export interface ForceGraphMethods {
  scene: () => Scene
  camera: () => Camera
  renderer: () => Renderer
  postProcessingComposer: () => PostProcessing
}

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
  quality?: number
}
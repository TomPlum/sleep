import { Scene } from 'three'

export interface ForceGraphMethods {
  scene: () => Scene
}

export interface LinkConfig {
  source: string
  target: string
  value: number
}

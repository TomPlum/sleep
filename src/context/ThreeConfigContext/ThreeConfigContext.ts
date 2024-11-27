import { createContext } from 'react'
import { ThreeConfigContextBag } from './types'

export const ThreeConfigContext = createContext<ThreeConfigContextBag>({
  showAxes: false,
  setShowAxes: (showAxes: boolean) => {
    console.error(`Tried to invoke setShowAxes(${showAxes}) before ThreeConfigContext was initialised.`)
  }
})
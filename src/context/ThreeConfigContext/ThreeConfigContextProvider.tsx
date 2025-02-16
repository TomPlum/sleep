import { PropsWithChildren, useMemo, useState } from 'react'
import { ThreeConfigContextBag, ThreeConfigContextProviderProps } from './types'
import { ThreeConfigContext } from './ThreeConfigContext'

export const ThreeConfigContextProvider = ({ children, resetCamera }: PropsWithChildren<ThreeConfigContextProviderProps>) => {
  const [showAxes, setShowAxes] = useState(false)
  const [draggableNodes, setDraggableNodes] = useState(false)
  const [resettingCamera, setResettingCamera] = useState(false)

  const values = useMemo<ThreeConfigContextBag>(() => ({
    showAxes,
    setShowAxes,
    draggableNodes,
    setDraggableNodes,
    resetCamera,
    resettingCamera,
    setResettingCamera
  }), [showAxes, draggableNodes, resetCamera, resettingCamera])

  return (
    <ThreeConfigContext.Provider value={values}>
      {children}
    </ThreeConfigContext.Provider>
  )
}
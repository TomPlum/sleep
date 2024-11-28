import { PropsWithChildren, useMemo, useState } from 'react'
import { ThreeConfigContextBag, ThreeConfigContextProviderProps } from './types'
import { ThreeConfigContext } from './ThreeConfigContext'

export const ThreeConfigContextProvider = ({ children, onResetCamera }: PropsWithChildren<ThreeConfigContextProviderProps>) => {
  const [showAxes, setShowAxes] = useState(false)
  const [draggableNodes, setDraggableNodes] = useState(false)

  const values = useMemo<ThreeConfigContextBag>(() => ({
    showAxes,
    setShowAxes,
    draggableNodes,
    setDraggableNodes,
    onResetCamera
  }), [showAxes, draggableNodes, onResetCamera])

  return (
    <ThreeConfigContext.Provider value={values}>
      {children}
    </ThreeConfigContext.Provider>
  )
}
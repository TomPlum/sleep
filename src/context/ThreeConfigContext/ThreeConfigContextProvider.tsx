import { PropsWithChildren, useMemo, useState } from 'react'
import { ThreeConfigContextBag } from './types'
import { ThreeConfigContext } from './ThreeConfigContext'

export const ThreeConfigContextProvider = ({ children }: PropsWithChildren) => {
  const [showAxes, setShowAxes] = useState(false)
  const [draggableNodes, setDraggableNodes] = useState(false)

  const values = useMemo<ThreeConfigContextBag>(() => ({
    showAxes,
    setShowAxes,
    draggableNodes,
    setDraggableNodes
  }), [showAxes, draggableNodes])

  return (
    <ThreeConfigContext.Provider value={values}>
      {children}
    </ThreeConfigContext.Provider>
  )
}
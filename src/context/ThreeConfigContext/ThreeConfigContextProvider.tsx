import { PropsWithChildren, useMemo, useState } from 'react'
import { ThreeConfigContextBag } from './types'
import { ThreeConfigContext } from './ThreeConfigContext'

export const ThreeConfigContextProvider = ({ children }: PropsWithChildren) => {
  const [showAxes, setShowAxes] = useState(false)

  const values = useMemo<ThreeConfigContextBag>(() => ({
    showAxes,
    setShowAxes
  }), [showAxes])

  return (
    <ThreeConfigContext.Provider value={values}>
      {children}
    </ThreeConfigContext.Provider>
  )
}
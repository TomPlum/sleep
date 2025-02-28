import { ShowcaseContext } from 'modules/Highlights/Showcase/context/ShowcaseContext'
import { PropsWithChildren, useMemo, useState } from 'react'
import { ShowcaseContextBag } from 'modules/Highlights/Showcase/context/types'

export const ShowcaseContextProvider = ({ children }: PropsWithChildren) => {
  const [active, setActive] = useState(0)
  console.log('active from provider', active)

  const value = useMemo<ShowcaseContextBag>(() => ({
    active,
    onEnd: () => {
      console.log('Incrementing active showcase...')
      setActive(i => i + 1)
    }
  }), [active])

  return (
    <ShowcaseContext.Provider value={value}>
      {children}
    </ShowcaseContext.Provider>
  )
}
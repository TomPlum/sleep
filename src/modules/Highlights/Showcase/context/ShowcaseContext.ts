import { createContext } from 'react'
import { ShowcaseContextBag } from './types'

export const ShowcaseContext = createContext<ShowcaseContextBag>({
  active: 0,
  onEnd: () => {
    console.debug('Tried to invoke onEnd() before the ShowcaseContext was initialised.')
  }
})
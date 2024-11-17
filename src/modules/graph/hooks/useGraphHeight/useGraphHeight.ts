import { useMemo } from 'react'
import { GraphHeight, GraphHeightProps } from 'modules/graph/hooks/useGraphHeight/types'
import { useSleepContext } from 'context'

export const useGraphHeight = ({ selectedSession }: GraphHeightProps): GraphHeight => {
  const { stackedView } = useSleepContext()

  const height = useMemo<string>(() => {
    if (stackedView) {
      return selectedSession ? '37.5%' : '50%'
    }

    return selectedSession ? '75%' : '100%'
  }, [stackedView, selectedSession])

  return {
    height
  }
}
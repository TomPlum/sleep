import { useMemo } from 'react'
import { GraphHeight } from 'modules/MetricLineChart/hooks/useGraphHeight/types'
import { useSleepContext } from 'context/SleepContext'
import { useChartConfigContext } from 'context/ChartConfigContext'

export const useGraphHeight = (): GraphHeight => {
  const { selectedSession } = useSleepContext()
  const { stackedView } = useChartConfigContext()

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
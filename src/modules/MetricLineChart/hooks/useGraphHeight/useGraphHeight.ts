import { useMemo } from 'react'
import { GraphHeight } from 'modules/MetricLineChart/hooks/useGraphHeight/types'
import { useSleepContext } from 'context/SleepContext'
import { useChartConfigContext } from 'context/ChartConfigContext'
import { ChartView } from 'modules/ChartControls/components/ChartViewSelector/types'

export const useGraphHeight = (): GraphHeight => {
  const { selectedSession } = useSleepContext()
  const { chartView } = useChartConfigContext()

  const height = useMemo<string>(() => {
    if (chartView === ChartView.STACKED_METRICS) {
      return selectedSession ? '37.5%' : '50%'
    }

    return selectedSession ? '75%' : '100%'
  }, [chartView, selectedSession])

  return {
    height
  }
}
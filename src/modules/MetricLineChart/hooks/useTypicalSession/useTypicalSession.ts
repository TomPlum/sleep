import { useCallback, useMemo } from 'react'
import { SleepMetric } from 'modules/ChartControls'
import { useSleepContext } from 'context/SleepContext'
import {
  TypicalSessionArea,
  TypicalSessionProps,
  TypicalSessionResponse
} from 'modules/MetricLineChart/hooks/useTypicalSession/types'
import { getMetricColour } from 'modules/MetricLineChart/hooks/useGraphStyles'

export const useTypicalSession = ({ metrics }: TypicalSessionProps): TypicalSessionResponse => {
  const { graphData2d } = useSleepContext()

  const data = useMemo(() => {
    return graphData2d.data ?? []
  }, [graphData2d.data])

  const getAreaYOrdinates = useCallback((metric: SleepMetric) => {
    switch (metric) {
      case SleepMetric.AWAKE_TIME: {
        return {
          y1: 0, y2: 10
        }
      }
      case SleepMetric.DEEP_SLEEP: {
        return {
          y1: 10, y2: 25
        }
      }
      case SleepMetric.LIGHT_SLEEP: {
        return {
          y1: 40, y2: 60
        }
      }
      case SleepMetric.REM_SLEEP: {
        return {
          y1: 20, y2: 25
        }
      }
      case SleepMetric.QUALITY: {
        return {
          y1: 80, y2: 100
        }
      }
      case SleepMetric.DURATION: {
        return {
          y1: 90, y2: 110
        }
      }
    }
  }, [])

  const typicalSleepSessions = useMemo<TypicalSessionArea[]>(() => {
    const firstSession = data[0]?.xDate
    const lastSession = data[data.length - 1]?.xDate

    return metrics.map((metric: SleepMetric) => ({
      metric,
      x1: firstSession,
      x2: lastSession,
      ...getAreaYOrdinates(metric),
      fill: getMetricColour(metric).replace('rgb', 'rgba').replace(')', ', 0.25)')
    }))

  }, [data, getAreaYOrdinates, metrics])

  return {
    typicalSleepSessions
  }
}
import { useMemo } from 'react'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { useSleepContext } from 'context'
import { TypicalSessionArea, TypicalSessionResponse } from 'modules/graph/hooks/useTypicalSession/types'
import { useGraphStyles } from 'modules/graph/hooks/useGraphStyles'

export const useTypicalSession = (): TypicalSessionResponse => {
  const { currentMetricColour } = useGraphStyles()
  const { graphData2d, sleepMetric } = useSleepContext()

  const data = useMemo(() => {
    return graphData2d.data ?? []
  }, [graphData2d.data])

  const typicalSleepSession = useMemo<TypicalSessionArea>(() => {
    const firstSession = data[0]?.xDate
    const lastSession = data[data.length - 1]?.xDate

    switch (sleepMetric) {
      case SleepMetric.AWAKE_TIME: {
        return {
          x1: firstSession, y1: 0,
          x2: lastSession, y2: 5
        }
      }
      case SleepMetric.DEEP_SLEEP: {
        return {
          x1: firstSession, y1: 10,
          x2: lastSession, y2: 25
        }
      }
      case SleepMetric.LIGHT_SLEEP: {
        return {
          x1: firstSession, y1: 40,
          x2: lastSession, y2: 60
        }
      }
      case SleepMetric.REM_SLEEP: {
        return {
          x1: firstSession, y1: 20,
          x2: lastSession, y2: 25
        }
      }
      case SleepMetric.QUALITY: {
        return {
          x1: firstSession, y1: 80,
          x2: lastSession, y2: 100
        }
      }
      case SleepMetric.DURATION: {
        return {
          x1: firstSession, y1: 90,
          x2: lastSession, y2: 110
        }
      }
    }
  }, [data, sleepMetric])

  const typicalSleepSessionFill = useMemo<string>(() => {
    return currentMetricColour.replace('rgb', 'rgba').replace(')', ', 0.25)')
  }, [currentMetricColour])

  return {
    typicalSleepSession,
    typicalSleepSessionFill
  }
}
import { useMemo } from 'react'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { GraphStylesProps, GraphStylesResponse } from 'modules/graph/hooks/useGraphStyles/types'
import { useSleepContext } from 'context'

export const getMetricColour = (metric: SleepMetric): string => {
  switch (metric) {
    case SleepMetric.LIGHT_SLEEP: {
      return 'rgb(84,234,153)'
    }
    case SleepMetric.AWAKE_TIME: {
      return 'rgb(255,188,21)'
    }
    case SleepMetric.DEEP_SLEEP: {
      return 'rgb(21,150,255)'
    }
    case SleepMetric.REM_SLEEP: {
      return 'rgb(255,71,231)'
    }
    case SleepMetric.QUALITY: {
      return 'rgb(145,71,255)'
    }
    case SleepMetric.DURATION: {
      return 'rgb(248,242,32)'
    }
  }
}

export const useGraphStyles = ({ metric }: GraphStylesProps): GraphStylesResponse => {
  const { activeSessions } = useSleepContext()

  const currentMetricColour = getMetricColour(metric)

  const strokeWidth = useMemo<number>(() => {
    if (activeSessions < 50) {
      return 5
    } else if (activeSessions > 50 && activeSessions < 500) {
      return 3
    } else {
      return 1
    }
  }, [activeSessions])

  const activeDotRadius = useMemo<number>(() => {
    if (activeSessions < 100) {
      return 7
    } else if (activeSessions > 100 && activeSessions < 300) {
      return 6
    } else if (activeSessions > 300 && activeSessions < 1000) {
      return 2
    } else {
      return 0
    }
  }, [activeSessions])

  return {
    currentMetricColour,
    getMetricColour,
    strokeWidth,
    activeDotRadius
  }
}
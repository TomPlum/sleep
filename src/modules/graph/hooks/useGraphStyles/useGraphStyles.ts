import {useCallback, useMemo} from "react";
import {SleepMetric} from "modules/controls/MetricConfiguration";
import {GetMetricColour, GraphStylesResponse} from "modules/graph/hooks/useGraphStyles/types.ts";
import {useSleepContext} from "context";

export const useGraphStyles = (): GraphStylesResponse => {
  const { sleepMetric, activeSessions } = useSleepContext()

  const getMetricColour = useCallback<GetMetricColour>((metric: SleepMetric) => {
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
    }
  }, [])

  const currentMetricColour = getMetricColour(sleepMetric)

  const strokeWidth = useMemo<number>(() => {
    if (activeSessions < 50) {
      return 5
    } else if (activeSessions > 50 && activeSessions < 500) {
      return 3
    } else {
      return 1
    }
  }, [activeSessions])

  const xAxisInterval = useMemo<number>(() => {
    if (activeSessions < 100) {
      return 5
    } else if (activeSessions > 100 && activeSessions < 250) {
      return 10
    } else {
      return 60
    }
  }, [activeSessions])

  const activeDotRadius = useMemo<number>(() => {
    if (activeSessions < 100) {
      return 10
    } else if (activeSessions > 100 && activeSessions < 300) {
      return 8
    } else {
      return 3
    }
  }, [activeSessions])

  return {
    currentMetricColour,
    getMetricColour,
    strokeWidth,
    xAxisInterval,
    activeDotRadius
  }
}
import {useCallback} from "react";
import {SleepMetric} from "modules/controls/MetricConfiguration";
import {GetMetricColour} from "modules/graph/hooks/useGraphStyles/types.ts";

export const useGraphStyles = () => {
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

  return {
    getMetricColour
  }
}
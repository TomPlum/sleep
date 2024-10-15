import {useMemo} from "react";
import {SleepMetric} from "modules/controls/MetricConfiguration";
import {useSleepContext} from "context";
import {TypicalSessionArea, TypicalSessionResponse} from "modules/graph/hooks/useTypicalSession/types.ts";

export const useTypicalSession = (): TypicalSessionResponse => {
  const { graphData2d, sleepMetric } = useSleepContext()

  const data = useMemo(() => {
    return graphData2d.data ?? []
  }, [graphData2d.data])

  const typicalSleepSession = useMemo<TypicalSessionArea>(() => {
    const lastSession = data?.length - 1

    switch (sleepMetric) {
      case SleepMetric.AWAKE_TIME: {
        return {
          x1: 0, y1: 0,
          x2: lastSession, y2: 5
        }
      }
      case SleepMetric.DEEP_SLEEP: {
        return {
          x1: 0, y1: 10,
          x2: lastSession, y2: 25
        }
      }
      case SleepMetric.LIGHT_SLEEP: {
        return {
          x1: 0, y1: 40,
          x2: lastSession, y2: 60
        }
      }
      case SleepMetric.REM_SLEEP: {
        return {
          x1: 0, y1: 20,
          x2: lastSession, y2: 25
        }
      }
      case SleepMetric.QUALITY: {
        return {
          x1: 0, y1: 80,
          x2: lastSession, y2: 100
        }
      }
    }
  }, [data, sleepMetric])

  return {
    typicalSleepSession
  }
}
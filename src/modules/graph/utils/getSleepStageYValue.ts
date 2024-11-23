import { SleepStage } from 'data/useSleepData'
import { SleepMetric } from 'modules/controls/MetricConfiguration'

export const getSleepStageYValue = (stage: SleepStage) => {
  switch (stage) {
    case SleepMetric.AWAKE_TIME: {
      return 3
    }
    case SleepMetric.REM_SLEEP: {
      return 2
    }
    case SleepMetric.LIGHT_SLEEP: {
      return 1
    }
    case SleepMetric.DEEP_SLEEP: {
      return 0
    }
  }
}
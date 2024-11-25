import { SleepStage } from 'data/useSleepData'
import { SleepMetric } from 'modules/ChartControls'

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

export const getSleepStageFromYValue = (value: number): SleepStage => {
  switch (Math.round(value)) {
    case 3: {
      return SleepMetric.AWAKE_TIME
    }
    case 2: {
      return SleepMetric.REM_SLEEP
    }
    case 1: {
      return SleepMetric.LIGHT_SLEEP
    }
    case 0: {
      return SleepMetric.DEEP_SLEEP
    }
    default: {
      throw new Error(`Invalid SleepMetric Y-Value ${value}`)
    }
  }
}
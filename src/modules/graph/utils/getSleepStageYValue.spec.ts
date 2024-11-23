import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { getSleepStageYValue } from './getSleepStageYValue'
import { SleepStage } from 'data/useSleepData'

describe('Get Sleep Stage Metric Y Value', () => {
  it.each([
    ['deep sleep', { stage: SleepMetric.DEEP_SLEEP, expectedYValue: 0 }],
    ['light sleep', { stage: SleepMetric.LIGHT_SLEEP, expectedYValue: 1 }],
    ['rem sleep', { stage: SleepMetric.REM_SLEEP, expectedYValue: 2 }],
    ['awake time', { stage: SleepMetric.AWAKE_TIME, expectedYValue: 3 }]
  ])('should return the correct y-axis value for the %s stage', (_, { stage, expectedYValue }) => {
    const actualValue = getSleepStageYValue(stage as SleepStage)
    expect(actualValue).toBe(expectedYValue)
  })
})
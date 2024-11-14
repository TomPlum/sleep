import { convertSleepStage } from 'modules/worker/utility/convertSleepStage'
import { SleepMetric } from 'modules/controls/MetricConfiguration'

describe('Convert Sleep Stage', () => {
  it('should return deep sleep for a value of 0.0', () => {
    const sleepStage = convertSleepStage(0.0)
    expect(sleepStage).toBe(SleepMetric.DEEP_SLEEP)
  })

  it('should return light sleep for a value of 1.0', () => {
    const sleepStage = convertSleepStage(1.0)
    expect(sleepStage).toBe(SleepMetric.LIGHT_SLEEP)
  })

  it('should return REM sleep for a value of 2.0', () => {
    const sleepStage = convertSleepStage(2.0)
    expect(sleepStage).toBe(SleepMetric.REM_SLEEP)
  })

  it('should return awake time for a value of 3.0', () => {
    const sleepStage = convertSleepStage(3.0)
    expect(sleepStage).toBe(SleepMetric.AWAKE_TIME)
  })

  it('should throw an error for an unknown value', () => {
    const convertInvalidValue = () => convertSleepStage(17)
    expect(convertInvalidValue).toThrowError('Invalid Sleep Stage Value [17]')
  })
})
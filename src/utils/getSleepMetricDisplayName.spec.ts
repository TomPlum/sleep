import { SleepMetric } from 'modules/ChartControls'
import { getSleepMetricDisplayName } from 'utils/getSleepMetricDisplayName'

describe('Get Sleep Metric Display Name', () => {
  it.each([
    [
      'REM sleep',
      {
        metric: SleepMetric.AWAKE_TIME,
        displayName: 'Awake Time'
      }
    ],
    [
      'Light sleep',
      {
        metric: SleepMetric.REM_SLEEP,
        displayName: 'Rem Sleep'
      }
    ],
    [
      'Deep sleep',
      {
        metric: SleepMetric.LIGHT_SLEEP,
        displayName: 'Light Sleep'
      }
    ],
    [
      'Deep sleep',
      {
        metric: SleepMetric.DEEP_SLEEP,
        displayName: 'Deep Sleep'
      }
    ],
    [
      'Sleep quality',
      {
        metric: SleepMetric.QUALITY,
        displayName: 'Quality'
      }
    ],
    [
      'Duration',
      {
        metric: SleepMetric.DURATION,
        displayName: 'Duration Percent'
      }
    ]
  ])('should convert the %s sleep metric to the correct display name', (_, { displayName, metric }) => {
    const actualDisplayName = getSleepMetricDisplayName(metric)
    expect(actualDisplayName).toBe(displayName)
  })
})
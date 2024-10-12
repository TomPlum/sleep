export interface MetricConfigurationProps {
  current: SleepMetric
  className?: string
  onMetricChange: (metric: SleepMetric) => void
}

export enum SleepMetric {
  QUALITY = 'quality',
  LIGHT_SLEEP = 'light_sleep',
  DEEP_SLEEP = 'deep_sleep',
  REM_SLEEP = 'rem_sleep',
  AWAKE_TIME = 'awake_time'
}
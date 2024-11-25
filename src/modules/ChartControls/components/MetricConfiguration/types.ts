export interface MetricConfigurationProps {
  className?: string
}

export enum SleepMetric {
  QUALITY = 'quality',
  LIGHT_SLEEP = 'light_sleep',
  DEEP_SLEEP = 'deep_sleep',
  REM_SLEEP = 'rem_sleep',
  AWAKE_TIME = 'awake_time',
  DURATION = 'duration_percent'
}
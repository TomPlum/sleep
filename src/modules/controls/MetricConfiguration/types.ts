export interface MetricConfigurationProps {
  current: SleepMetric
  className?: string
  onMetricChange: (metric: SleepMetric) => void
}

export enum SleepMetric {
  QUALITY,
  LIGHT_SLEEP,
  DEEP_SLEEP,
  REM_SLEEP,
  AWAKE_TIME
}
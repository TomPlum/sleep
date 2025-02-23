import { SleepMetricLineChartDatum } from 'modules/MetricLineChart'

export interface HighligthedSessions {
  bestSession: SleepMetricLineChartDatum
  worstSession: SleepMetricLineChartDatum
  mostRecentSession?: SleepMetricLineChartDatum
}
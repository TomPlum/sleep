import { SleepMetricLineChartData } from 'modules/MetricLineChart'
import { SleepMetric } from 'modules/ChartControls'

export interface SleepMetricLineProps {
  key?: string
  metric: SleepMetric
  data: SleepMetricLineChartData
  onClickActiveDot: (index: number) => void
}
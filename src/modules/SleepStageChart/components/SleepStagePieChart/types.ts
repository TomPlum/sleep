import { SleepMetric } from 'modules/ChartControls'
import { SleepSessionGraph2DDatum } from 'modules/MetricLineChart'

export interface SleepStagePieDatum {
  /**
   * The sleep metric that the
   * percentage represents.
   */
  metric: SleepMetric

  /**
   * The name of the metric for
   * the pie segment.
   */
  name: string

  /**
   * The value, as a percentage
   * of the session for the metric.
   */
  value: number

  /**
   * The total time, in minutes,
   * of all instances of the current
   * {@link metric} for the session.
   */
  duration: number
}

export interface DurationBreakdownPieProps {
  sessionData: SleepSessionGraph2DDatum
}

export interface BreakdownPieLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  value: number
}
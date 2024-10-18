import { SleepMetric } from 'modules/controls/MetricConfiguration'

export interface DurationBreakdownPieData {
  /**
   * The number of minutes that I was
   * deemed to be awake by Pillow
   * during the session.
   */
  awake: number

  /**
   * The number of minutes that I was
   * deemed to be in light-sleep by
   * Pillow during the session.
   */
  light: number

  /**
   * The number of minutes that I was
   * deemed to be in deep-sleep by
   * Pillow during the session.
   */
  deep: number

  /**
   * The number of minutes that I was
   * deemed to be in REM (Rapid Eye Movement)
   * sleep by Pillow during the session.
   */
  rem: number
}

export interface DurationBreakdownPieDataRaw {
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
}

export interface DurationBreakdownPieProps {
  data: DurationBreakdownPieData
}

export interface BreakdownPieLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  value: number
}
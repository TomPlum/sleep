import { SleepMetric } from 'modules/controls/MetricConfiguration'

export interface TypicalSessionArea {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface TypicalSessionProps {
  metric: SleepMetric
}

export interface TypicalSessionResponse {
  /**
   * Coordinates for plotting a reference
   * area on the chart that represents
   * a healthy or "typical" range of
   * percentage values for the active
   * sleep metric.
   */
  typicalSleepSession: TypicalSessionArea

  /**
   * A hex or RGB(A) colour code for the fill
   * colour of the reference area.
   */
  typicalSleepSessionFill: string
}
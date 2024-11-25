import { SleepMetric } from 'modules/ChartControls'

export interface TypicalSessionArea {
  /**
   * The bottom-left x-ordinate of
   * the area.
   */
  x1: number

  /**
   * The bottom-left y-ordinate of
   * the area.
   */
  y1: number

  /**
   * The top-right x-ordinate of
   * the area.
   */
  x2: number

  /**
   * The top-right y-ordinate of
   * the area.
   */
  y2: number

  /**
   * A hex or RGB(A) colour code for the fill
   * colour of the reference area.
   */
  fill: string

  /**
   * The sleep metric that this area
   * represents.
   */
  metric: SleepMetric
}

export interface TypicalSessionProps {
  /**
   * A list of sleep metrics to generate
   * area metadata for.
   */
  metrics: SleepMetric[]
}

export interface TypicalSessionResponse {
  /**
   * Coordinates for plotting reference
   * areas on the chart that represents
   * a healthy or "typical" range of
   * percentage values for the active
   * sleep metric.
   */
  typicalSleepSessions: TypicalSessionArea[]
}
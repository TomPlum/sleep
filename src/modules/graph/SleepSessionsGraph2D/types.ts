import {SleepMetric} from "modules/controls/MetricConfiguration";

export type SleepSessionGraph2DData = SleepSessionGraph2DDatum[] | undefined

export interface SleepSessionsGraph2DProps {
  currentMetric: SleepMetric

  /**
   * The lower bound within which to
   * filter the sleep sessions to in
   * the rendered graph.
   */
  rangeStart: Date

  /**
   * The upper bound within which to
   * filter the sleep sessions to in
   * the rendered graph.
   */
  rangeEnd: Date
}

export interface SleepSessionGraph2DDatum {
  /**
   * The date of the sleep session as a
   * pretty formatted date string for
   * rendering on the graphs x-axis.
   */
  _date: string

  /**
   * The date of the sleep session. Left in
   * a raw Date format for DayJS to operate on.
   */
  date: Date

  /**
   * The value, as a percentage of the
   * current selected sleep data metric.
   * E.g. Quality, Deep Sleep, REM etc.
   */
  [metric: string]: number | string | Date
}
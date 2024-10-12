export type SleepSessionGraph2DData = SleepSessionGraph2DDatum[] | undefined

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
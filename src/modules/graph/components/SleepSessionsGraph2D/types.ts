import {SleepMetric} from "modules/controls/MetricConfiguration";

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
   * The value, as a percentage, of
   * sleep quality as determined by
   * Pillow for the current session.
   */
  [SleepMetric.QUALITY]: number

  /**
   * The value, as a percentage of
   * the session, of deep sleep recorded
   * during the current session.
   */
  [SleepMetric.DEEP_SLEEP]: number

  /**
   * The value, as a percentage of
   * the session, of light sleep recorded
   * during the current session.
   */
  [SleepMetric.LIGHT_SLEEP]: number

  /**
   * The value, as a percentage of
   * the session, of REM sleep recorded
   * during the current session.
   */
  [SleepMetric.REM_SLEEP]: number

  /**
   * The value, as a percentage of
   * the session, of awake time recorded
   * during the current session.
   */
  [SleepMetric.AWAKE_TIME]: number
}

export type SleepStage = SleepMetric.DEEP_SLEEP | SleepMetric.LIGHT_SLEEP | SleepMetric.REM_SLEEP | SleepMetric.AWAKE_TIME
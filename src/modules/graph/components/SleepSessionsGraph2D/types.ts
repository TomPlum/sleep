import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { SleepMood } from 'data/useSleepData'

export interface SleepSessionsGraph2DProps {
  /**
   * The sleep metric to render on
   * the graph.
   */
  metric: SleepMetric

  /**
   * A callback function invoked when the
   * user select a session from the graph
   * to be able to view the sleep stage
   * breakdown chart.
   *
   * @param id The index of the selected session from the filtered session data.
   */
  onSelectSession: (index: number) => void

  /**
   * The ID of the currently selected
   * sleep session that is being displayed
   * in the stage breakdown chart. Is undefined
   * if one is not currently selected.
   */
  selectedSession?: string

  /**
   * An optional class name to pass into
   * the underlying container element.
   */
  className?: string
}

export type SleepSessionGraph2DData = SleepSessionGraph2DDatum[]

export interface SleepSessionGraph2DDatum {
  /**
   * The unique identifier for the sleep session
   * on the graph.
   */
  id: string

  /**
   * The date of the sleep session as
   * the number of milliseconds from the
   * epoch so the x-axis can be used in a
   * number format and timescale.
   */
  xDate: number

  /**
   * The date of the sleep session. Left in
   * a raw Date format for DayJS to operate on.
   */
  date: Date

  /**
   * The total duration of the sleep
   * session in minutes.
   * I.e. How long I slept for.
   */
  duration: number

  /**
   * Whether the session has been
   * determined to be a nap as per
   * Pillow's internal algorithms.
   * These are usually much shorter.
   */
  isNap: boolean

  mood: SleepMood

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

  /**
   * The total duration of the sleep
   * session as a percentage of 8 hours.
   */
  [SleepMetric.DURATION]: number
}
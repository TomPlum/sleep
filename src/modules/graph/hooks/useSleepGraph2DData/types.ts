import type { SleepSessionGraph2DData } from 'modules/graph/components/SleepSessionsGraph2D'
import { PillowSleepSession } from 'data/useSleepData'

export interface SleepGraph2DDataProps {
  /**
   * A list of the currently active
   * sleep sessions being rendered.
   */
  sessions: PillowSleepSession[]

  /**
   * Whether sleep data is loading.
   */
  isSleepDataLoading: boolean

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

  /**
   * Whether to include nap sessions
   * in the data output.
   */
  includeNaps: boolean
}

export interface SleepGraph2DDataResponse {
  /**
   * The sleep session data structured for
   * rendering a 2D graph.
   */
  data: SleepSessionGraph2DData

  /**
   * Whether the sleep data is still
   * loading.
   */
  isSleepDataLoading: boolean

  /**
   * The date of the earliest sleep
   * session in the actively rendered
   * (and filtered) dataset. There could
   * still be an earlier recorded session
   * as part of the raw data.
   */
  earliestSession: Date

  /**
   * The date of the latest sleep
   * session in the actively rendered
   * (and filtered) dataset. There could
   * still be a later recorded session
   * as part of the raw data.
   */
  latestSession: Date
}
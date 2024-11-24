import { PillowSleepData } from 'data/useSleepData'
import { SleepGraph2DDataResponse } from 'modules/MetricLineChart/hooks/useSleepGraph2DData'
import { RawSleepSessionSounds, RawSleepSessionStages } from 'data/useRawSleepData/types'

export interface SleepContextBag {
  /**
   * The core dataset parsed from the exported
   * file from the Pillow iOS app. This is unfiltered
   * and simply converted to a nicer internal domain
   * model.
   */
  sleepData?: PillowSleepData

  /**
   * A map of sleep stage data for a given sleep
   * session ID.
   */
  sleepStageData: RawSleepSessionStages

  /**
   * A map of sleep sound data for a given sleep
   * session ID.
   */
  sleepSoundData: RawSleepSessionSounds

  /**
   * The ID of the sleep session that is currently
   * selected. Is undefined if no session is selected.
   */
  selectedSession?: number

  /**
   * Whether the read IO or conversion process of
   * the data is in progress.
   */
  isSleepDataLoading: boolean

  /**
   * The filtered data from {@link sleepData}
   * after any filters have been applied. This
   * is what the {@link SleepSessionsGraph2D}
   * uses to render its graph visual.
   */
  graphData2d: SleepGraph2DDataResponse

  /**
   * The number of unique sleep sessions
   * currently being rendered on the graph
   * after any filters have been applied.
   */
  activeSessions: number

  /**
   * The date in which I started to make
   * effective improvements to my lifestyle
   * that positively impacted my sleep quality.
   * The closest date from the session dataset
   * is picked.
   *
   * If the current active data-set (due to
   * filtering) does not include this date,
   * undefined is returned.
   */
  improvementDate?: Date
}
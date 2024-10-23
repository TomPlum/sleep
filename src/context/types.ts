import { PillowSleepData } from 'data/useSleepData'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { SleepGraph2DDataResponse } from 'modules/graph/hooks/useSleepGraph2DData'
import { Dispatch, SetStateAction } from 'react'

export interface SleepContextBag {
  /**
   * The core dataset parsed from the exported
   * file from the Pillow iOS app. This is unfiltered
   * and simply converted to a nicer internal domain
   * model.
   */
  sleepData?: PillowSleepData

  /**
   * Whether the read IO or conversion process of
   * the data is in progress.
   */
  isSleepDataLoading: boolean

  /**
   * The start date from which to filter the sleep
   * session data from when rendering the graph.
   * Is present as a query parameter and driven
   * by the date range picker.
   */
  rangeStart: Date

  /**
   * Sets a new start date for the range filter.
   * @param start The new start date.
   */
  setRangeStart: (start: Date) => void

  /**
   * The end date from which to filter the sleep
   * session data from when rendering the graph.
   * Is present as a query parameter and driven
   * by the date range picker.
   */
  rangeEnd: Date

  /**
   * Sets a new end date for the range filter.
   * @param end The new end date.
   */
  setRangeEnd: (end: Date) => void

  /**
   * The currently selected sleep metric to
   * render on the graph.
   */
  sleepMetric: SleepMetric

  /**
   * Sets a new sleep metric for the graph.
   * @param metric The new sleep metric.
   */
  setSleepMetric: (metric: SleepMetric) => void

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

  /**
   * Whether the user has toggled the option
   * to view multiple stacked graphs together.
   */
  stackedView: boolean

  /**
   * A function that overrides the current
   * value of the stacked view toggle.
   */
  setStackedView: (stackedView: boolean) => void

  /**
   * An array of sleep metrics in which to
   * render graphs for if {@link stackedView}
   * is toggled on.
   */
  stackedMetrics: SleepMetric[]

  /**
   * Sets the array of sleep metrics to be
   * used to render graphs for in the stacked
   * view.
   * @param metrics A list of new metrics.
   */
  setStackedMetrics: Dispatch<SetStateAction<SleepMetric[]>>
}
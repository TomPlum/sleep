import { PillowSleepData } from "data/useSleepData"
import { SleepMetric } from "modules/controls/MetricConfiguration"
import { SleepGraph2DDataResponse } from "modules/graph/hooks/useSleepGraph2DData"

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
}
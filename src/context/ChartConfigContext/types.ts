import { SleepMetric } from 'modules/ChartControls'
import { Dispatch, SetStateAction } from 'react'

export interface ChartConfigContextBag {
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
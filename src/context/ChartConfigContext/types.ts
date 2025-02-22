import { SleepMetric } from 'modules/ChartControls'
import { Dispatch, SetStateAction } from 'react'
import { ChartView } from 'modules/ChartControls/components/ChartViewSelector/types'

export interface ChartConfigContextBag {
  /**
   * The start date from which to filter the sleep
   * session data from when rendering the graph.
   *
   * Is present as a query parameter and driven
   * by the date range picker.
   *
   * May be undefined in some renders if, for example,
   * the page is loaded with no date range query parameters.
   * It will then be calculated once data is loaded
   * and set using {@link setRangeStart}.
   */
  rangeStart?: Date

  /**
   * Sets a new start date for the range filter.
   * @param start The new start date.
   */
  setRangeStart: (start: Date) => void

  /**
   * The end date from which to filter the sleep
   * session data from when rendering the graph.
   *
   * Is present as a query parameter and driven
   * by the date range picker.
   *
   * May be undefined in some renders if, for example,
   * the page is loaded with no date range query parameters.
   * It will then be calculated once data is loaded
   * and set using {@link setRangeEnd}.
   */
  rangeEnd?: Date

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
   * The currently selected view type for
   * the main sleep chart.
   */
  chartView: ChartView

  /**
   * Changes the current view type for the
   * main sleep chart.
   *
   * @param chartView The new view to switch to.
   */
  setChartView: (chartView: ChartView) => void

  /**
   * An array of sleep metrics in which to
   * render graphs for if teh selected
   * {@link chartView} requires multiple
   * metrics to be selected.
   */
  activeMetrics: SleepMetric[]

  /**
   * Sets the array of sleep metrics to be
   * used to render graphs for in the stacked
   * view.
   * @param metrics A list of new metrics.
   */
  setActiveMetrics: Dispatch<SetStateAction<SleepMetric[]>>

  /**
   * Denotes whether the 3D
   * mode is active.
   */
  is3DActive: boolean

  /**
   * Sets a new value for the 3D
   * experimental mode.
   *
   * @param is3D The new value for is3D.
   */
  setIs3DActive: (is3D: boolean) => void
}
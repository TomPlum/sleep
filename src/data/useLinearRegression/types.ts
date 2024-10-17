export interface LinearRegressionPlotPoint {
  /**
   * The number of milliseconds since the epoch
   * of the date on the x-axis of the graph that
   * can be used to render the linear regression
   * line of best fit.
   */
  xDate: number

  /**
   * The percentage value of the y-axis to
   * plot the point against.
   */
  y: number
}

export interface DeltaLinePlotPoint {
  /**
   * The number of milliseconds since the epoch
   * of the date on the x-axis of the graph that
   * can be used to render a vertical line that
   * intercepts the x-axis. The line shows
   * the end of the linear regression line
   * to form part of the dotted triangle that
   * shows the delta.
   */
  xDate: number

  /**
   * The percentage value of the y-axis to
   * plot the point against.
   */
  y: number
}

export interface LinearRegressionResponse {
  /**
   * Coordinates of the linear regression
   * line to be plotted on the graph.
   */
  regressionLineData: LinearRegressionPlotPoint[]

  /**
   * The key used by Recharts to plot
   * the linear regression line.
   */
  regressionDataKey: string

  /**
   * The difference between the maximum
   * and the minimum percentage values
   * plotted by the linear regression line.
   */
  regressionDelta: string

  /**
   * A set of two plot-points for plotting
   * a vertical line on the chart between
   * the right-most point of the regression
   * line and the point at which it would
   * intercept with its horizontal variant.
   */
  regressionLineDeltaVertical: DeltaLinePlotPoint[]

  /**
   * The percentage value along the
   * y-axis of the graph that can be used
   * to render a horizontal line that intercepts
   * the y-axis at this point. The line shows
   * the start of the linear regression line
   * to form part of the dotted triangle that
   * shows the delta.
   */
  yRegressionDeltaLine: number
}
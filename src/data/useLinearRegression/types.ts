import {SleepMetric} from "modules/controls/MetricConfiguration";

export interface LinearRegressionDataPoint {
  x: number
  y: number
}

export interface LinearRegressionProps {
  metric: SleepMetric
  data: LinearRegressionDataPoint[]
}

export interface LinearRegressionPlotPoint {
  _date: string
  [metric: string]: number | string
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
   * The index of the date value along the
   * x-axis of the graph that can be used
   * to render a vertical line that intercepts
   * the x-axis at this point. The line shows
   * the end of the linear regression line
   * to form part of the dotted triangle that
   * shows the delta.
   */
  xRegressionDeltaLine: number

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


/**
 * Details of a regression line that
 * can be plotted via the equation
 * y = mx + b, where (m) is the slope
 * or gradient and b is the point in
 * which the line intercepts the y-axis.
 */
export interface RegressionLine {
  slope: number
  yIntercept: number
}
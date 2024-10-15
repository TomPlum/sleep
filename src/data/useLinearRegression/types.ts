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
  regressionLineData: LinearRegressionPlotPoint[]
  regressionDataKey: string
  regressionDelta: string
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
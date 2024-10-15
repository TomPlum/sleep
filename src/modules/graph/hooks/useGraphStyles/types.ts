import {SleepMetric} from "modules/controls/MetricConfiguration";

export type GetMetricColour = (metric: SleepMetric) => string

export interface GraphStylesResponse {
  /**
   * Gets the thematic colour used in
   * visualisations from the given
   * sleep metric.
   * @param metric The metric to get the colour for.
   */
  getMetricColour: (metric: SleepMetric) => string

  /**
   * The thematic colour used in
   * visualisations based on the current
   * sleep metric in context.
   */
  currentMetricColour: string

  /**
   * The width of the line or "stroke"
   * for the line graph based on the
   * number of active sessions being
   * rendered. A greater number of sessions
   * means a denser dataset and so the line
   * is thinned out for legibility.
   */
  strokeWidth: number

  /**
   * The number of ticks that will
   * render on the x-axis relative
   * to the number of active sessions.
   * A greater number of sessions will
   * mean fewer ticks and more spacing
   * between them for legibility.
   */
  xAxisInterval: number

  /**
   * The radius of the circle that
   * is the "active dot" on the line.
   * These are bigger and prominent
   * on smaller datasets and smaller
   * on larger ones for legibility.
   */
  activeDotRadius: number
}
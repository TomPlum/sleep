export interface Axes2D {

  /**
   * The lower and upper bounds
   * of the percentage value of the
   * current metric to pass to the
   * y-axis. This will always have
   * 2 values only.
   */
  yDomain: number[]

  /**
   * Session timestamps as milliseconds
   * from the epoch used by the x-axis
   * for rendering ticks.
   */
  xTicks: number[]

  /**
   * The range of percentage values
   * to be used by the y-axis. The
   * values generated wrap around the
   * active sessions y-domain so that
   * it hugs its bounds closes but not
   * explicitly.
   *
   * E.g. Values: [26, 67, 71] -> Domain: [20, 80]
   */
  yTicks: number[]
}
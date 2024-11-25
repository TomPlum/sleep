export interface RegressionDeltaLabelProps {
  /**
   * The x-ordinate of the label.
   */
  x: number

  /**
   * The y-ordinate of the label.
   */
  y: number

  /**
   * The difference between the maximum
   * and the minimum percentage values
   * plotted by the linear regression line.
   */
  regressionDelta: number
}
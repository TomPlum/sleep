import { SleepMetric } from 'modules/ChartControls'

export interface MetricButtonProps {
  /**
   * The metric that this button should
   * select for.
   */
  metric: SleepMetric

  /**
   * An optional class name to pass
   * to the underlying button element.
   */
  className?: string

  /**
   * An optional callback function
   * invoked when the user mouses
   * over the button.
   */
  onMouseOver?: () => void

  /**
   * An optional callback function
   * invoked when the user mouses
   * out of the button.
   */
  onMouseOut?: () => void

  /**
   * When passed, the default handleClick
   * implementation will be ignored in
   * favour of this handler.
   */
  onClick?: (metric: SleepMetric) => void
}
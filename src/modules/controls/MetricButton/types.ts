import { SleepMetric } from 'modules/controls/MetricConfiguration'

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
}
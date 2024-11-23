import { SleepMetric } from 'modules/ChartControls'

export interface MetricCheckboxProps {
  /**
   * The metric that this checkbox should
   * toggle for.
   */
  metric: SleepMetric

  /**
   * An optional class name to pass
   * to the underlying checkbox element.
   */
  className?: string
}
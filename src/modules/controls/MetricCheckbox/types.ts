import { SleepMetric } from 'modules/controls/MetricConfiguration'

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

  /**
   * The type of selector.
   *
   * Checkboxes will be checked if
   * the current metric matches.
   */
  type: 'checkbox' | 'button'
}
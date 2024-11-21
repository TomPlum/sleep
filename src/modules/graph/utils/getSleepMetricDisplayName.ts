import { SleepMetric } from 'modules/controls/MetricConfiguration'

/**
 * Converts a {@link SleepMetric} into a pretty
 * display name formatted for rendering on the UI.
 *
 * @param metric The metric to format
 */
export const getSleepMetricDisplayName = (metric: SleepMetric) => {
  return `${metric.split('_').map((v: string) => `${v.charAt(0).toUpperCase()}${v.slice(1)}`).join(' ')}`
}
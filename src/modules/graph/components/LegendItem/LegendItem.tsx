import { getMetricColour } from 'modules/graph/hooks/useGraphStyles'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import styles from './LegendItem.module.scss'
import { getSleepMetricDisplayName } from 'modules/graph/utils/getSleepMetricDisplayName'

export const LegendItem = (value: string) => {
  return (
    <span style={{ color: getMetricColour(value as SleepMetric) }} className={styles.item}>
       {getSleepMetricDisplayName(value as SleepMetric)}
     </span>
  )
}
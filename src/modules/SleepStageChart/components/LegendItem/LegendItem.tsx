import { getMetricColour } from 'modules/MetricLineChart/hooks/useGraphStyles'
import { SleepMetric } from 'modules/ChartControls'
import styles from './LegendItem.module.scss'
import { getSleepMetricDisplayName } from 'utils/getSleepMetricDisplayName'

export const LegendItem = (value: string) => {
  return (
    <span style={{ color: getMetricColour(value as SleepMetric) }} className={styles.item}>
       {getSleepMetricDisplayName(value as SleepMetric)}
     </span>
  )
}
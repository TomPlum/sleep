import { getMetricColour } from 'modules/graph/hooks/useGraphStyles'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import styles from './LegendItem.module.scss'

export const LegendItem = (value: string) => {
  return (
    <span style={{ color: getMetricColour(value as SleepMetric) }} className={styles.item}>
       {`${value.split('_').map((v: string) => `${v.charAt(0).toUpperCase()}${v.slice(1)}`).join(' ')}`}
     </span>
  )
}
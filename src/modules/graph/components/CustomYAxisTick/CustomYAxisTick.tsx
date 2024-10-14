import {CustomYAxisTickProps} from "modules/graph/components/CustomYAxisTick/types.ts";
import styles from './CustomYAxisTick.module.scss'

export const CustomYAxisTick = ({ x, y, payload}: CustomYAxisTickProps) => {
  return (
    <text x={x + 15} y={y + 5} textAnchor="start" className={styles.tick}>
      {payload.value}%
    </text>
  )
}
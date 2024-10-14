import styles from './CustomXAxisTick.module.scss'
import {CustomXAxisTickProps} from "./types.ts";

export const CustomXAxisTick = ({ x, y, payload}: CustomXAxisTickProps) => {
  return (
    <text x={x} y={y - 15} textAnchor='middle' className={styles.tick}>
      {payload.value}
    </text>
  )
}
import styles from './CustomXAxisTick.module.scss'
import {CustomXAxisTickProps} from "./types.ts";
import dayjs from "dayjs";

export const CustomXAxisTick = ({ x, y, payload}: CustomXAxisTickProps) => {
  return (
    <text x={x} y={y - 15} textAnchor='middle' className={styles.tick}>
      {dayjs(new Date(payload.value)).format('MMM YY')}
    </text>
  )
}
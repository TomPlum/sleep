import styles from './CustomXAxisTick.module.scss'
import { CustomXAxisTickProps } from "./types.ts"
import dayjs from "dayjs"
import { useMemo } from "react"

export const CustomXAxisTick = ({ x, y, payload, earliestSession, latestSession }: CustomXAxisTickProps) => {
  const epochMillis = payload.value

  const textAnchor = useMemo(() => {
    if (epochMillis === earliestSession.getTime()) {
      return 'start'
    } else if (epochMillis === latestSession.getTime()) {
      return 'end'
    }

    return 'middle'
  }, [earliestSession, epochMillis, latestSession])

  return (
    <text x={x} y={y - 15} textAnchor={textAnchor} className={styles.tick}>
      {dayjs(new Date(epochMillis)).format('MMM YY')}
    </text>
  )
}
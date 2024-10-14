import {CustomYAxisTickProps} from "modules/graph/components/CustomYAxisTick/types.ts";
import styles from './CustomYAxisTick.module.scss'

export const CustomYAxisTick = ({ x, y, payload }: CustomYAxisTickProps) => {
  const textValue = payload.value as number
  const rectWidth = textValue < 10 ? 28 : textValue < 100 ? 38 : 46
  const rectHeight = 20
  const xLocation = x + 15
  const yLocation = y + 5

  console.log(payload, textValue, rectWidth, rectHeight)

  return (
    <g>
      <rect
        x={xLocation - 2}
        y={yLocation - rectHeight + 4}
        width={rectWidth}
        height={rectHeight}
        className={styles.background}
        rx={4}
        ry={4}
      />

      <text x={xLocation} y={yLocation} textAnchor="start" className={styles.tick}>
        {payload.value}%
      </text>
    </g>
  )
}
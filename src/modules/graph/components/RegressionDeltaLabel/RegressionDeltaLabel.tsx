import { RegressionDeltaLabelProps } from 'modules/graph/components/RegressionDeltaLabel/types'
import styles from './RegressionDeltaLabel.module.scss'

export const RegressionDeltaLabel = ({ x, y, regressionDelta }: RegressionDeltaLabelProps) => {
  const yOffset = Number(regressionDelta) > 0 ? y - 15 : y + 25

  return (
    <text x={x - 10} y={yOffset} className={styles.label} textAnchor='end'>
      {`Δ ${regressionDelta}%`}
    </text>
  )
}
import { RegressionDeltaLabelProps } from 'modules/graph/components/RegressionDeltaLabel/types'

export const RegressionDeltaLabel = ({ x, y, regressionDelta }: RegressionDeltaLabelProps) => {
  const yOffset = Number(regressionDelta) > 0 ? y - 15 : y + 25

  return (
    <text x={x - 10} y={yOffset} fill='#dcdcdc' textAnchor='end'>
      {`Δ ${regressionDelta}%`}
    </text>
  )
}
import { getMetricColour } from 'modules/graph/hooks/useGraphStyles'
import { SleepStageBarProps } from './types'

export const SleepStageBar = ({ cx, cy, payload, chartHeight, uniqueMetrics }: SleepStageBarProps) => {
  const barHeight = (chartHeight / uniqueMetrics * 0.9) - 40

  return (
    <g>
      <rect
        x={cx}
        width={4}
        height={barHeight}
        y={(cy ?? 0) - barHeight / 2}

        fill={getMetricColour(payload.stage).replace('rgb', 'rgba').replace(')', ', 1)')}
      />
    </g>
  )
}
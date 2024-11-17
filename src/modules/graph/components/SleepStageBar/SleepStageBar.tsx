import { getMetricColour } from 'modules/graph/hooks/useGraphStyles'
import { SleepStageBarProps } from './types'

export const SleepStageBar = ({ cx, cy, payload, xAxis, chartHeight, uniqueMetrics }: SleepStageBarProps) => {
  const barWidth = xAxis.scale(payload.end.valueOf()) - xAxis.scale(payload.start.valueOf())
  const barHeight = (chartHeight / uniqueMetrics * 0.9) - 40

  return (
    <g>
      <rect
        x={cx}
        rx={4}
        ry={4}
        width={barWidth}
        height={barHeight}
        y={(cy ?? 0) - barHeight / 2}
        style={{
          stroke: getMetricColour(payload.stage),
          strokeWidth: 2
        }}
        fill={getMetricColour(payload.stage).replace('rgb', 'rgba').replace(')', ', 0.80)')}
      />
    </g>
  )
}
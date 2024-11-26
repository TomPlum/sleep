import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import {
  BreakdownPieLabelProps,
  DurationBreakdownPieProps,
  SleepStagePieDatum
} from 'modules/SleepStageChart/components/SleepStagePieChart/types'
import { useCallback, useMemo } from 'react'
import { SleepMetric } from 'modules/ChartControls'
import { getMetricColour } from 'modules/MetricLineChart/hooks/useGraphStyles'
import { SleepStage } from 'data/useSleepData'
import { SleepStagePieTooltip } from 'modules/SleepStageChart/components/SleepStagePieTooltip'

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: BreakdownPieLabelProps) => {
  if (value === 0) {
    return null
  }

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="#0e0e0e" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(value ?? 0).toFixed(0)}%`}
    </text>
  )
}

export const SleepStagePieChart = ({ sessionData }: DurationBreakdownPieProps) => {
  const percentageOf = useCallback((stage: SleepStage) => {
    return (sessionData[stage] / 100) * sessionData.duration
  }, [sessionData])

  const pieData = useMemo<SleepStagePieDatum[]>(() => {
    const percentages = {
      awake: sessionData[SleepMetric.AWAKE_TIME],
      deep: sessionData[SleepMetric.DEEP_SLEEP],
      light: sessionData[SleepMetric.LIGHT_SLEEP],
      rem: sessionData[SleepMetric.REM_SLEEP]
    }

    return ([
      { name: 'Deep', value: percentages.deep, metric: SleepMetric.DEEP_SLEEP, duration: percentageOf(SleepMetric.DEEP_SLEEP) },
      { name: 'Light', value: percentages.light, metric: SleepMetric.LIGHT_SLEEP, duration: percentageOf(SleepMetric.LIGHT_SLEEP) },
      { name: 'REM', value: percentages.rem, metric: SleepMetric.REM_SLEEP, duration: percentageOf(SleepMetric.REM_SLEEP) },
      { name: 'Awake', value: percentages.awake, metric: SleepMetric.AWAKE_TIME, duration: percentageOf(SleepMetric.AWAKE_TIME) }
    ])
  }, [percentageOf, sessionData])

  return (
    <PieChart width={200} height={200} data={pieData}>
      <Pie
        cx='50%'
        cy='50%'
        data={pieData}
        dataKey='value'
        outerRadius={80}
        stroke='#0e0e0e'
        labelLine={false}
        animationBegin={0}
        animationDuration={500}
        label={renderCustomizedLabel}
      >
        {pieData.map(({ metric }, index) => (
          <Cell key={`cell-${index}`} fill={getMetricColour(metric)} />
        ))}
      </Pie>

      <Tooltip content={SleepStagePieTooltip} />
    </PieChart>
  )
}
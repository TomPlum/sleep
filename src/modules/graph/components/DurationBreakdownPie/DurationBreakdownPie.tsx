import { Cell, Pie, PieChart } from 'recharts'
import {
  BreakdownPieLabelProps,
  DurationBreakdownPieDataRaw,
  DurationBreakdownPieProps
} from 'modules/graph/components/DurationBreakdownPie/types.ts'
import { useMemo } from 'react'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { useGraphStyles } from 'modules/graph/hooks/useGraphStyles'

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: BreakdownPieLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="#0e0e0e" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${value.toFixed(0)}%`}
    </text>
  )
}

export const DurationBreakdownPie = ({ data }: DurationBreakdownPieProps) => {
  const { getMetricColour } = useGraphStyles()

  const pieData = useMemo<DurationBreakdownPieDataRaw[]>(() => ([
    { name: 'Deep', value: data.deep, metric: SleepMetric.DEEP_SLEEP },
    { name: 'Light', value: data.light, metric: SleepMetric.LIGHT_SLEEP },
    { name: 'REM', value: data.rem, metric: SleepMetric.REM_SLEEP },
    { name: 'Awake', value: data.awake, metric: SleepMetric.AWAKE_TIME }
  ]), [data])

  return (
    <PieChart width={200} height={200}>
      <Pie
        cx='50%'
        cy='50%'
        data={pieData}
        dataKey='value'
        outerRadius={80}
        stroke='#0e0e0e'
        labelLine={false}
        label={renderCustomizedLabel}
      >
        {pieData.map(({ metric }, index) => (
          <Cell key={`cell-${index}`} fill={getMetricColour(metric)} />
        ))}
      </Pie>
    </PieChart>
  )
}
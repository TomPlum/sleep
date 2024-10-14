import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useMemo} from "react";
import {SleepSessionsGraph2DProps} from './index.ts'
import dayjs from 'dayjs';
import {useLinearRegression} from "data/useLinearRegression";
import {CustomYAxisTick} from "modules/graph/components/CustomYAxisTick";
import {SleepSessionTooltip} from "modules/graph/components/SleepSessionTooltip";
import {CustomXAxisTick} from "modules/graph/components/CustomXAxisTick";
import {useSleepGraph2DData} from "modules/graph/hooks/useSleepGraph2DData";
import {useGraphStyles} from "modules/graph/hooks/useGraphStyles";

export const SleepSessionsGraph2D = ({ currentMetric, rangeStart, rangeEnd }: SleepSessionsGraph2DProps) => {
  const { getMetricColour } = useGraphStyles()
  const { data } = useSleepGraph2DData({ rangeStart, rangeEnd })

  const { regressionLineData, regressionDataKey } = useLinearRegression({
    metric: currentMetric,
    data: data?.map(session => ({
      x: dayjs(session.date).valueOf(),
      y: session[currentMetric] as number
    })) ?? []
  })

  const strokeWidth = useMemo<number>(() => {
    if (!data) {
      return 3
    }

    if (data.length < 50) {
      return 5
    } else if (data.length > 50 && data.length < 500) {
      return 3
    } else {
      return 1
    }
  }, [data])

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart
        data={[...data ?? []]}
        id='sleeps-sessions-graph-2d'
        margin={{ left: -52, bottom: -22 }}
      >
        <XAxis
          interval={20}
          dataKey='_date'
          strokeWidth={3}
          axisLine={false}
          padding={{ left: 60 }}
          tick={CustomXAxisTick}
          stroke='rgb(255, 255, 255)'
        />

        <YAxis
          strokeWidth={3}
          axisLine={false}
          domain={[0, 100]}
          orientation='left'
          tick={CustomYAxisTick}
          dataKey={currentMetric}
          stroke='rgb(255, 255, 255)'
          padding={{ bottom: 40, top: 40 }}
          tickFormatter={value => `${value}%`}
          ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        />

        <Tooltip content={SleepSessionTooltip} />

        <Line
          type='monotone'
          dataKey={currentMetric}
          animationDuration={500}
          isAnimationActive={true}
          strokeWidth={strokeWidth}
          id={`${currentMetric}_line`}
          animationEasing='ease-in-out'
          stroke={getMetricColour(currentMetric)}
        />

        <Line
          dot={false}
          type='monotone'
          animationDuration={500}
          isAnimationActive={true}
          data={regressionLineData}
          strokeWidth={strokeWidth}
          stroke='rgb(255, 255, 255)'
          dataKey={regressionDataKey}
          animationEasing='ease-in-out'
          id={`${currentMetric}_regression_line`}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
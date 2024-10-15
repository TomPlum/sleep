import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useMemo} from "react";
import dayjs from 'dayjs';
import {useLinearRegression} from "data/useLinearRegression";
import {CustomYAxisTick} from "modules/graph/components/CustomYAxisTick";
import {SleepSessionTooltip} from "modules/graph/components/SleepSessionTooltip";
import {CustomXAxisTick} from "modules/graph/components/CustomXAxisTick";
import {useGraphStyles} from "modules/graph/hooks/useGraphStyles";
import {useSleepContext} from "context";

export const SleepSessionsGraph2D = () => {
  const { getMetricColour } = useGraphStyles()
  const { graphData2d: { data }, sleepMetric } = useSleepContext()

  const { regressionLineData, regressionDataKey } = useLinearRegression({
    metric: sleepMetric,
    data: data?.map(session => ({
      x: dayjs(session.date).valueOf(),
      y: session[sleepMetric] as number
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

  const xAxisInterval = useMemo<number>(() => {
    if (!data) {
      return 5
    }

    if (data.length < 100) {
      return 5
    } else if (data.length > 100 && data.length < 250) {
      return 10
    } else {
      return 60
    }
  }, [data])

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart
        data={[...data ?? []]}
        id='sleeps-sessions-graph-2d'
        margin={{ left: -53, bottom: -22 }}
      >
        <Line
          type='monotone'
          dataKey={sleepMetric}
          animationDuration={500}
          isAnimationActive={true}
          strokeWidth={strokeWidth}
          id={`${sleepMetric}_line`}
          animationEasing='ease-in-out'
          stroke={getMetricColour(sleepMetric)}
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
          id={`${sleepMetric}_regression_line`}
        />

        <XAxis
          dataKey='_date'
          strokeWidth={3}
          axisLine={false}
          padding={{ left: 0 }}
          tick={CustomXAxisTick}
          interval={xAxisInterval}
          allowDataOverflow={true}
          stroke='rgb(255, 255, 255)'
        />

        <YAxis
          strokeWidth={3}
          axisLine={false}
          domain={[0, 100]}
          orientation='left'
          dataKey={sleepMetric}
          tick={CustomYAxisTick}
          stroke='rgb(255, 255, 255)'
          padding={{ bottom: 40, top: 60 }}
          tickFormatter={value => `${value}%`}
          ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        />

        <Tooltip content={SleepSessionTooltip} />
      </LineChart>
    </ResponsiveContainer>
  )
}
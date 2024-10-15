import {Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import dayjs from 'dayjs';
import {useLinearRegression} from "data/useLinearRegression";
import {CustomYAxisTick} from "modules/graph/components/CustomYAxisTick";
import {SleepSessionTooltip} from "modules/graph/components/SleepSessionTooltip";
import {CustomXAxisTick} from "modules/graph/components/CustomXAxisTick";
import {useGraphStyles} from "modules/graph/hooks/useGraphStyles";
import {useSleepContext} from "context";
import styles from './SleepSessionGraph2D.module.scss'
import {useMemo} from "react";

export const SleepSessionsGraph2D = () => {
  const { graphData2d: { data }, sleepMetric } = useSleepContext()
  const { currentMetricColour, strokeWidth, xAxisInterval, activeDotRadius } = useGraphStyles()

  const { regressionLineData, regressionDataKey } = useLinearRegression({
    metric: sleepMetric,
    data: data?.map(session => ({
      x: dayjs(session.date).valueOf(),
      y: session[sleepMetric] as number
    })) ?? []
  })

  const regressionDeltaHorizontal = useMemo(() => {
    const firstSession = regressionLineData[0]
    const x = firstSession._date
    const y = firstSession[sleepMetric]
    return { x, y }
  }, [regressionLineData, sleepMetric])

  const regressionDeltaVertical = useMemo(() => {
    const x = regressionLineData[regressionLineData.length - 1]._date
    console.log(x)
    return { x }
  }, [regressionLineData])
  console.log(data)

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
          stroke={currentMetricColour}
          animationEasing='ease-in-out'
          className={styles.metricLine}
          dot={{ fill: undefined, r: activeDotRadius }}
        />

        <Line
          dot={false}
          type='monotone'
          animationDuration={500}
          isAnimationActive={true}
          strokeWidth={strokeWidth}
          data={regressionLineData}
          stroke='rgb(255, 255, 255)'
          dataKey={regressionDataKey}
          animationEasing='ease-in-out'
          id={`${sleepMetric}_regression_line`}
        />

        <ReferenceLine
          type='monotone'
          strokeDasharray='3 3'
          stroke='rgb(255, 255, 255)'
          x={regressionDeltaHorizontal.x}
          y={regressionDeltaHorizontal.y}
          id={`${sleepMetric}_regression_line_delta_h`}
        />

        <ReferenceLine
          type='monotone'
          strokeDasharray='3 3'
          stroke='rgb(255, 255, 255)'
          x={regressionDeltaVertical.x}
          id={`${sleepMetric}_regression_line_delta_v`}
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
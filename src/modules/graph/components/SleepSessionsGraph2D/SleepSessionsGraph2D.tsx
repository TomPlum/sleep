import {
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {useLinearRegression} from "data/useLinearRegression";
import {CustomYAxisTick} from "modules/graph/components/CustomYAxisTick";
import {SleepSessionTooltip} from "modules/graph/components/SleepSessionTooltip";
import {CustomXAxisTick} from "modules/graph/components/CustomXAxisTick";
import {useGraphStyles} from "modules/graph/hooks/useGraphStyles";
import {useSleepContext} from "context";
import styles from './SleepSessionGraph2D.module.scss'
import {useTypicalSession} from "modules/graph/hooks/useTypicalSession/useTypicalSession.ts";
import {useMemo} from "react";

export const SleepSessionsGraph2D = () => {
  const { typicalSleepSession } = useTypicalSession()
  const { graphData2d: { data }, sleepMetric } = useSleepContext()
  const { currentMetricColour, strokeWidth, xAxisInterval, activeDotRadius } = useGraphStyles()

  const {
    regressionLineData,
    regressionDataKey,
    regressionDelta,
    xRegressionDeltaLine,
    yRegressionDeltaLine
  } = useLinearRegression()

  const { yDomain, yTicks } = useMemo(() => {
    if (data) {
      const smallest = Math.min(...data.map(it => Number((it[sleepMetric] as number).toFixed(0))))
      const lowerBound = smallest < 20 ? smallest : smallest - 10
      const biggest = Math.max(...data.map(it => Number((it[sleepMetric] as number).toFixed(0))))
      const upperBound = biggest > 90 ? biggest : biggest + 10

      const closestLower = Math.round(lowerBound / 10) * 10
      const closestUpper = Math.round(upperBound / 10) * 10

      const yTicks = Array.from({
        length: Math.floor(closestUpper / 10) - Math.ceil(closestLower / 10) + 1
      }).reduce((acc: number[], _, i) => {
        return acc.concat(Math.ceil(closestLower / 10) * 10 + i * 10)
      }, [])

      return {
        yDomain: [lowerBound, upperBound],
        yTicks
      }
    }

    return {
      yDomain: [],
      yTicks: []
    }
  }, [data, sleepMetric])

  console.log(yDomain, yTicks)

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart
        data={[...data ?? []]}
        id='sleeps-sessions-graph-2d'
        margin={{ left: -55, bottom: -22 }}
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
          y={yRegressionDeltaLine}
          stroke='rgb(255, 255, 255)'
          label={`Δ ${regressionDelta}%`}
          id={`${sleepMetric}_regression_line_delta_h`}
        />

        <ReferenceLine
          type='monotone'
          strokeDasharray='3 3'
          x={xRegressionDeltaLine}
          stroke='rgb(255, 255, 255)'
          id={`${sleepMetric}_regression_line_delta_v`}
        />

        {typicalSleepSession && (
          <ReferenceArea
            ifOverflow='extendDomain'
            x1={typicalSleepSession.x1}
            x2={typicalSleepSession.x2}
            y1={typicalSleepSession.y1}
            y2={typicalSleepSession.y2}
            id={`${sleepMetric}_typical_sleep_session_area`}
            fill={currentMetricColour.replace('rgb', 'rgba').replace(')', ', 0.25)')}
          />
        )}

        <XAxis
          dataKey='_date'
          strokeWidth={3}
          axisLine={false}
          padding={{ left: -5 }}
          tick={CustomXAxisTick}
          interval={xAxisInterval}
          allowDataOverflow={true}
          stroke='rgb(255, 255, 255)'
        />

        <YAxis
          ticks={yTicks}
          strokeWidth={3}
          axisLine={false}
          domain={yDomain}
          orientation='left'
          dataKey={sleepMetric}
          tick={CustomYAxisTick}
          stroke='rgb(255, 255, 255)'
          padding={{ bottom: 40, top: 60 }}
          tickFormatter={value => `${value}%`}
        />

        <Tooltip content={SleepSessionTooltip} />
      </LineChart>
    </ResponsiveContainer>
  )
}
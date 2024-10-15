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
import dayjs from 'dayjs';
import {useLinearRegression} from "data/useLinearRegression";
import {CustomYAxisTick} from "modules/graph/components/CustomYAxisTick";
import {SleepSessionTooltip} from "modules/graph/components/SleepSessionTooltip";
import {CustomXAxisTick} from "modules/graph/components/CustomXAxisTick";
import {useGraphStyles} from "modules/graph/hooks/useGraphStyles";
import {useSleepContext} from "context";
import styles from './SleepSessionGraph2D.module.scss'
import {useMemo} from "react";
import {SleepStage} from "modules/graph/components/SleepSessionsGraph2D";
import {SleepMetric} from "modules/controls/MetricConfiguration";

export const SleepSessionsGraph2D = () => {
  const { graphData2d: { data }, sleepMetric } = useSleepContext()
  const { currentMetricColour, strokeWidth, xAxisInterval, activeDotRadius } = useGraphStyles()

  const { regressionLineData, regressionDataKey, regressionDelta, xRegressionDeltaLine, yRegressionDeltaLine } = useLinearRegression({
    metric: sleepMetric,
    data: data?.map(session => ({
      x: dayjs(session.date).valueOf(),
      y: session[sleepMetric] as number
    })) ?? []
  })

  const typicalSleepSession = useMemo(() => {
    const lastSession = data?.length - 1
    const sleepStage = sleepMetric as SleepStage
    switch (sleepStage) {
      case SleepMetric.AWAKE_TIME: {
        return {
          x1: 0, y1: 0,
          x2: lastSession, y2: 5
        }
      }
      case SleepMetric.DEEP_SLEEP: {
        return {
          x1: 0, y1: 5,
          x2: lastSession, y2: 20
        }
      }
      case SleepMetric.LIGHT_SLEEP: {
        return {
          x1: 0, y1: 40,
          x2: lastSession, y2: 50
        }
      }
      case SleepMetric.REM_SLEEP: {
        return {
          x1: 0, y1: 20,
          x2: lastSession, y2: 25
        }
      }
    }
  }, [data, sleepMetric])
  console.log(typicalSleepSession)

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
            x1={typicalSleepSession.x1}
            x2={typicalSleepSession.x2}
            y1={typicalSleepSession.y1}
            y2={typicalSleepSession.y2}
            id={`${sleepMetric}_typical_sleep_session_area`}
            fill={currentMetricColour.replace('rgb', 'rgba').replace(')', ', 0.3)')}
          />
        )}

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
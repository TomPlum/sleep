import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useCallback, useMemo} from "react";
import {SleepSessionsGraph2DProps} from './'
import {SleepMetric} from "modules/controls/MetricConfiguration";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {type SleepSessionGraph2DData} from "./types";
import {useLinearRegression} from "data/useLinearRegression";
import {useSleepContext} from "context";
import {CustomYAxisTick} from "modules/graph/CustomYAxisTick";
import {SleepSessionTooltip} from "modules/graph/SleepSessionTooltip";

dayjs.extend(isBetween);

export const SleepSessionsGraph2D = ({ currentMetric, rangeStart, rangeEnd }: SleepSessionsGraph2DProps) => {
  const { sleepData } = useSleepContext()

  const convertDurationToPercentage = useCallback((duration: number, total: number) => {
    return (duration / total) * 100
  }, [])

  const lineColour = useMemo(() => {
    switch (currentMetric) {
      case SleepMetric.LIGHT_SLEEP: {
        return 'rgb(84,234,153)'
      }
      case SleepMetric.AWAKE_TIME: {
        return 'rgb(255,188,21)'
      }
      case SleepMetric.DEEP_SLEEP: {
        return 'rgb(21,150,255)'
      }
      case SleepMetric.REM_SLEEP: {
        return 'rgb(255,71,231)'
      }
      case SleepMetric.QUALITY: {
        return 'rgb(145,71,255)'
      }
    }
  }, [currentMetric])

  const data = useMemo<SleepSessionGraph2DData>(() => {
    return sleepData?.sessions.map(session => {
      const totalDuration = session.duration.total
      return {
        _date: dayjs(session.startTime).format('MMM YY'),
        date: session.startTime,
        [SleepMetric.QUALITY]: session.sleepQuality,
        [SleepMetric.AWAKE_TIME]: convertDurationToPercentage(session.duration.awake, totalDuration),
        [SleepMetric.DEEP_SLEEP]: convertDurationToPercentage(session.duration.deep, totalDuration),
        [SleepMetric.REM_SLEEP]: convertDurationToPercentage(session.duration.rem, totalDuration),
        [SleepMetric.LIGHT_SLEEP]: convertDurationToPercentage(session.duration.light, totalDuration)
      }
    }).filter(({ date }) => {
      return dayjs(date).isBetween(dayjs(rangeStart), dayjs(rangeEnd), 'day', '[]')
    })
  }, [convertDurationToPercentage, rangeEnd, rangeStart, sleepData?.sessions])

  const { regressionLineData, regressionDataKey } = useLinearRegression({
    metric: currentMetric,
    data: data?.map(session => ({
      x: dayjs(session.date).valueOf(),
      y: session[currentMetric] as number
    })) ?? []
  })

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart data={data ? [...data] : data} margin={{ left: -50, top: 15 }}>
        <XAxis
          dataKey='_date'
          padding={{ left: 60 }}
          stroke='rgb(255, 255, 255)'
        />

        <YAxis
          axisLine={false}
          domain={[0, 100]}
          orientation='left'
          tick={CustomYAxisTick}
          dataKey={currentMetric}
          padding={{ bottom: 30 }}
          stroke='rgb(255, 255, 255)'
          tickFormatter={value => `${value}%`}
          ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        />

        <Tooltip content={SleepSessionTooltip} />

        <Line
          type='monotone'
          strokeWidth={3}
          stroke={lineColour}
          dataKey={currentMetric}
          isAnimationActive={true}
          animationDuration={500}
          animationEasing='ease-in-out'
        />

        <Line
          dot={false}
          type='monotone'
          strokeWidth={3}
          animationDuration={500}
          isAnimationActive={true}
          data={regressionLineData}
          stroke='rgb(255, 255, 255)'
          dataKey={regressionDataKey}
          animationEasing='ease-in-out'
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
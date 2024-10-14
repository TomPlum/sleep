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
import {CustomXAxisTick} from "modules/graph/CustomXAxisTick";

dayjs.extend(isBetween);

export const SleepSessionsGraph2D = ({ currentMetric, rangeStart, rangeEnd }: SleepSessionsGraph2DProps) => {
  const { sleepData } = useSleepContext()

  const toPercentage = useCallback((duration: number, total: number) => {
    return (duration / total) * 100
  }, [])

  const lineColour = useMemo<string>(() => {
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
      const duration = session.duration
      const totalDuration = duration.total

      return {
        _date: dayjs(session.startTime).format('MMM YY'),
        date: session.startTime,
        [SleepMetric.QUALITY]: session.sleepQuality,
        [SleepMetric.AWAKE_TIME]: toPercentage(duration.awake, totalDuration),
        [SleepMetric.DEEP_SLEEP]: toPercentage(duration.deep, totalDuration),
        [SleepMetric.REM_SLEEP]: toPercentage(duration.rem, totalDuration),
        [SleepMetric.LIGHT_SLEEP]: toPercentage(duration.light, totalDuration)
      }
    }).filter(({ date }) => {
      return dayjs(date).isBetween(dayjs(rangeStart), dayjs(rangeEnd), 'day', '[]')
    })
  }, [toPercentage, rangeEnd, rangeStart, sleepData?.sessions])

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
      <LineChart data={data ? [...data] : data} margin={{ left: -52, top: 15, bottom: -22 }}>
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
          padding={{ bottom: 30 }}
          stroke='rgb(255, 255, 255)'
          tickFormatter={value => `${value}%`}
          ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        />

        <Tooltip content={SleepSessionTooltip} />

        <Line
          type='monotone'
          stroke={lineColour}
          dataKey={currentMetric}
          animationDuration={500}
          isAnimationActive={true}
          strokeWidth={strokeWidth}
          animationEasing='ease-in-out'
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
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
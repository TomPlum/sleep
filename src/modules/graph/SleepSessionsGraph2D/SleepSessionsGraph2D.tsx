import {Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {PillowSleepSession} from "data/useSleepData";
import {useCallback, useMemo} from "react";
import {SleepSessionsGraph2DProps} from './'
import {SleepMetric} from "modules/controls/MetricConfiguration";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {type SleepSessionGraph2DData} from "./types";
import {useLinearRegression} from "data/useLinearRegression";
import {useSleepContext} from "context";

dayjs.extend(isBetween);

const CustomYAxisTick = ({ x, y, payload}: any) => {
  return (
    <text x={x + 15} y={y + 5} textAnchor="start" fill="#666">{payload.value}%</text>
  )
}

export const SleepSessionsGraph2D = ({ currentMetric, rangeStart, rangeEnd }: SleepSessionsGraph2DProps) => {
  const { sleepData } = useSleepContext()

  const getValueAsPercentage = useCallback((session: PillowSleepSession) => {
    const sessionDurationTotal = session.duration.total

    switch (currentMetric) {
      case SleepMetric.QUALITY: {
        return session.sleepQuality
      }
      case SleepMetric.AWAKE_TIME: {
        return (session.duration.awake / sessionDurationTotal) * 100
      }
      case SleepMetric.DEEP_SLEEP: {
        return (session.duration.deep / sessionDurationTotal) * 100
      }
      case SleepMetric.LIGHT_SLEEP: {
        return (session.duration.light / sessionDurationTotal) * 100
      }
      case SleepMetric.REM_SLEEP: {
        return (session.duration.rem / sessionDurationTotal) * 100
      }
    }
  }, [currentMetric])

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

  const data: SleepSessionGraph2DData = useMemo(() => {
    return sleepData?.sessions.map(session => ({
      _date: dayjs(session.startTime).format('MMM YY'),
      date: session.startTime,
      [currentMetric]: getValueAsPercentage(session)
    })).filter(({ date }) => {
      return dayjs(date).isBetween(dayjs(rangeStart), dayjs(rangeEnd), 'day', '[]')
    })
  }, [currentMetric, getValueAsPercentage, rangeEnd, rangeStart, sleepData?.sessions])

  const { regressionLineData, regressionDataKey } = useLinearRegression({
    metric: currentMetric,
    data: data?.map(session => ({
      x: dayjs(session.date).valueOf(),
      y: session[currentMetric] as number
    })) ?? []
  })

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart data={data} margin={{ left: -50, top: 15 }}>
        <XAxis
          dataKey='_date'
          padding={{ left: 60 }}
        />

        <YAxis
          axisLine={false}
          domain={[0, 100]}
          orientation='left'
          dataKey={currentMetric}
          padding={{ bottom: 30 }}
          tick={<CustomYAxisTick />}
          tickFormatter={value => `${value}%`}
          ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        />

        <Line
          type='monotone'
          strokeWidth={3}
          stroke={lineColour}
          dataKey={currentMetric}
        />

        <Line
          dot={false}
          type='monotone'
          strokeWidth={3}
          data={regressionLineData}
          stroke='rgb(255, 255, 255)'
          dataKey={regressionDataKey}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
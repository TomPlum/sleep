import {Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {PillowSleepSession, useSleepData} from "data/useSleepData";
import {useCallback, useMemo, useState} from "react";
import styles from './SleepSessionGraph2D.module.scss'
import {MetricConfiguration, SleepMetric} from "modules/controls/MetricConfiguration";
import { Spin } from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {DateRangePicker} from "modules/controls/DateRangePicker";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { type SleepSessionGraph2DData } from "./types";
import {useLinearRegression} from "data/useLinearRegression";
import {useSearchParams} from "react-router-dom";
import {useQueryParams} from "hooks/useQueryParams";

dayjs.extend(isBetween);

export const SleepSessionsGraph2D = () => {
  const { sleepData, loading } = useSleepData()

  const { queryParams: { start, end } } = useQueryParams()
  const [rangeEnd, setRangeEnd] = useState(end ?? sleepData?.latestSession)
  const [rangeStart, setRangeStart] = useState(start ?? dayjs(sleepData?.latestSession).subtract(2, 'month').toDate())

  const [searchParams] = useSearchParams()
  const defaultMetric = (searchParams.get('metric') ?? SleepMetric.QUALITY) as SleepMetric
  const [currentMetric, setCurrentMetric] = useState(defaultMetric)

  const handleDateRangeChange = useCallback((min: Date, max: Date) => {
    setRangeStart(min)
    setRangeEnd(max)
  }, [])

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
      _date: dayjs(session.startTime).format('MMM-YYYY'),
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

  if (loading || !data || !sleepData) {
    return (
      <Spin
        size="large"
        indicator={<LoadingOutlined spin />}
      />
    )
  }

  return (
    <div className={styles.container}>
      <MetricConfiguration
        current={currentMetric}
        className={styles.configPanel}
        onMetricChange={setCurrentMetric}
      />

      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={data}>
          {/*<CartesianGrid strokeDasharray='4 5' />*/}
          <XAxis dataKey='_date' />
          <YAxis
            domain={[0, 100]}
            dataKey={currentMetric}
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

      <DateRangePicker
        onChange={handleDateRangeChange}
        rangeEnd={sleepData.latestSession}
        rangeStart={sleepData.earliestSession}
      />
    </div>
  )
}
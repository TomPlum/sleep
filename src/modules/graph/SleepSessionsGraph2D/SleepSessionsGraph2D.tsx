import {CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {PillowSleepSession, useSleepData} from "data/useSleepData";
import {useCallback, useMemo, useState} from "react";
import styles from './SleepSessionGraph2D.module.scss'
import {MetricConfiguration, SleepMetric} from "modules/controls/MetricConfiguration";
import { Spin } from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {DateRangePicker} from "modules/controls/DateRangePicker";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export const SleepSessionsGraph2D = () => {
  const { sleepData, loading } = useSleepData()
  const [rangeStart, setRangeStart] = useState(dayjs(sleepData?.latestSession).subtract(2, 'month').toDate())
  const [rangeEnd, setRangeEnd] = useState(sleepData?.latestSession)
  const [currentMetric, setCurrentMetric] = useState(SleepMetric.QUALITY)

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

  const data = useMemo(() => {
    return sleepData?.sessions.map(session => ({
      _date: dayjs(session.startTime).format('MMM-YYYY'),
      date: session.startTime,
      [currentMetric]: getValueAsPercentage(session)
    })).filter(({ date }) => {
      return dayjs(date).isBetween(dayjs(rangeStart), dayjs(rangeEnd), 'day', '[]')
    })
  }, [currentMetric, getValueAsPercentage, rangeEnd, rangeStart, sleepData?.sessions])

  if (loading || !sleepData) {
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
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='_date' />
          <YAxis dataKey={currentMetric} />
          <Line
            type='monotone'
            strokeWidth={3}
            stroke={lineColour}
            dataKey={currentMetric}
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
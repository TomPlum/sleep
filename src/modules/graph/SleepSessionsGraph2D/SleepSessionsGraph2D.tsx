import {CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {PillowSleepSession, useSleepData} from "data/useSleepData";
import {useCallback, useMemo, useState} from "react";
import styles from './SleepSessionGraph2D.module.scss'
import {MetricConfiguration, SleepMetric} from "modules/controls/MetricConfiguration";
import { Spin } from "antd";
import {LoadingOutlined} from "@ant-design/icons";

export const SleepSessionsGraph2D = () => {
  const { sleepData, loading } = useSleepData()
  const [currentMetric, setCurrentMetric] = useState(SleepMetric.QUALITY)

  const getValue = useCallback((session: PillowSleepSession) => {
    switch (currentMetric) {
      case SleepMetric.QUALITY: {
        return session.sleepQuality
      }
      case SleepMetric.AWAKE_TIME: {
        return session.duration.awake
      }
      case SleepMetric.DEEP_SLEEP: {
        return session.duration.deep
      }
      case SleepMetric.LIGHT_SLEEP: {
        return session.duration.light
      }
      case SleepMetric.REM_SLEEP: {
        return session.duration.rem
      }
    }
  }, [currentMetric])

  const data = useMemo(() => {
    return sleepData?.sessions.map(session => ({
      date: session.startTime.toString(),
      quality: getValue(session)
    }))
  }, [getValue, sleepData?.sessions])

  if (loading) {
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
            <XAxis dataKey='date' />
            <YAxis dataKey='quality' />
            <Line type='monotone' dataKey='quality' />
          </LineChart>
        </ResponsiveContainer>
      </div>
  )
}
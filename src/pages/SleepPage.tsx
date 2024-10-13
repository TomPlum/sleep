import {useCallback, useEffect, useState} from "react";
import styles from './SleepPage.module.scss'
import {MetricConfiguration, SleepMetric} from "modules/controls/MetricConfiguration";
import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {DateRangePicker} from "modules/controls/DateRangePicker";
import dayjs from 'dayjs';
import {useQueryParams} from "hooks/useQueryParams";
import {SleepSessionsGraph2D} from "modules/graph/SleepSessionsGraph2D";
import {useSleepContext} from "context";

export const SleepPage = () => {
  const { sleepData, isSleepDataLoading } = useSleepContext()
  const { queryParams: { start, end, metric }, updateQueryParam } = useQueryParams()

  const [rangeEnd, setRangeEnd] = useState(end)
  const [rangeStart, setRangeStart] = useState(start)
  const [currentMetric, setCurrentMetric] = useState(metric)

  useEffect(() => {
    if (!isSleepDataLoading && sleepData) {
      const selectedMetric = currentMetric ?? SleepMetric.QUALITY
      setCurrentMetric(selectedMetric)

      const selectedStart = rangeStart ?? dayjs(sleepData.latestSession).subtract(2, 'month').toDate()
      setRangeStart(selectedStart)

      const selectedEnd = rangeEnd ?? sleepData.latestSession
      setRangeEnd(selectedEnd)

      const params: Record<string, string> = {
        metric: selectedMetric,
        start: selectedStart.getTime().toString(),
        end: selectedEnd.getTime().toString()
      }

      updateQueryParam({ route: '/sleep', params})
    }
  }, [currentMetric, isSleepDataLoading, rangeEnd, rangeStart, sleepData, updateQueryParam])

  const handleDateRangeChange = useCallback((min: Date, max: Date) => {
    setRangeStart(min)
    setRangeEnd(max)
  }, [])

  if (isSleepDataLoading || !sleepData || !currentMetric) {
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

      {rangeStart && rangeEnd && (
        <SleepSessionsGraph2D
          rangeEnd={rangeEnd}
          rangeStart={rangeStart}
          currentMetric={currentMetric}
        />
      )}

      <DateRangePicker
        onChange={handleDateRangeChange}
        rangeEnd={sleepData.latestSession}
        rangeStart={sleepData.earliestSession}
      />
    </div>
  )
}
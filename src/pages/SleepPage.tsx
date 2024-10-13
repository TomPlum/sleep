import {useCallback, useState} from "react";
import styles from './SleepPage.module.scss'
import {MetricConfiguration, SleepMetric} from "modules/controls/MetricConfiguration";
import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {DateRangePicker} from "modules/controls/DateRangePicker";
import dayjs from 'dayjs';
import {useSearchParams} from "react-router-dom";
import {useQueryParams} from "hooks/useQueryParams";
import {SleepSessionsGraph2D} from "modules/graph/SleepSessionsGraph2D";
import {useSleepContext} from "context";

export const SleepPage = () => {
  const { sleepData, isSleepDataLoading } = useSleepContext()

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

  if (isSleepDataLoading || !sleepData) {
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
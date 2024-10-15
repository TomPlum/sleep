import styles from './SleepPage.module.scss'
import {MetricConfiguration} from "modules/controls/MetricConfiguration";
import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {DateRangePicker} from "modules/controls/DateRangePicker";
import {SleepSessionsGraph2D} from "modules/graph/components/SleepSessionsGraph2D";
import {useSleepContext} from "context";

export const SleepPage = () => {
  const { activeSessions, isSleepDataLoading } = useSleepContext()

  if (isSleepDataLoading) {
    return (
      <Spin
        size="large"
        indicator={<LoadingOutlined spin />}
      />
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.sessions}>
        {activeSessions} sessions
      </div>

      <div className={styles.controls}>
        <MetricConfiguration
          className={styles.configPanel}
        />

        <DateRangePicker />
      </div>

      <SleepSessionsGraph2D />
    </div>
  )
}
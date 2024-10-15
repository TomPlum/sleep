import styles from './SleepPage.module.scss'
import {MetricConfiguration} from "modules/controls/MetricConfiguration";
import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {DateRangePicker} from "modules/controls/DateRangePicker";
import {SleepSessionsGraph2D} from "modules/graph/components/SleepSessionsGraph2D";
import {useSleepContext} from "context";
import {useTranslation} from "react-i18next";

export const SleepPage = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d' })
  const { activeSessions, sleepData, isSleepDataLoading } = useSleepContext()

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
        {t('sessions', {
          active: activeSessions,
          total: sleepData?.sessions.length
        })}
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
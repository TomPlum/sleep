import styles from './SleepPage.module.scss'
import {MetricConfiguration} from "modules/controls/MetricConfiguration";
import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {DateRangePicker} from "modules/controls/DateRangePicker";
import {SleepSessionsGraph2D} from "modules/graph/components/SleepSessionsGraph2D";
import {useSleepContext} from "context";
import {useTranslation} from "react-i18next";
import {useGraphStyles} from "modules/graph/hooks/useGraphStyles";

export const SleepPage = () => {
  const { currentMetricColour } = useGraphStyles()
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
        <span style={{ color: currentMetricColour }}>
          {t('sessions', {
            active: activeSessions,
            total: sleepData?.sessions.length
          })}
        </span>
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
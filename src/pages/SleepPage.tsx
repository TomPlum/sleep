import styles from './SleepPage.module.scss'
import { MetricConfiguration } from 'modules/controls/MetricConfiguration'
import { Spin } from 'antd'
import { GithubOutlined, LoadingOutlined } from '@ant-design/icons'
import { DateRangePicker } from 'modules/controls/DateRangePicker'
import { SleepSessionsGraph2D } from 'modules/graph/components/SleepSessionsGraph2D'
import { useSleepContext } from 'context'
import { useTranslation } from 'react-i18next'
import { useGraphStyles } from 'modules/graph/hooks/useGraphStyles'
import { LocaleToggle } from 'modules/controls/LocaleToggle'

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
      <div className={styles.topLeftControls}>
        <a href='https://github.com/TomPlum/sleep' rel='noreferrer'>
          <GithubOutlined
            className={styles.github}
          />
        </a>

        <p style={{ color: currentMetricColour }} className={styles.sessions}>
          {t('sessions', {
            active: activeSessions,
            total: sleepData?.sessions.length
          })}
        </p>
      </div>

      <div className={styles.controls}>
        <MetricConfiguration
          className={styles.configPanel}
        />

        <div className={styles.bottom}>
          <LocaleToggle className={styles.localeToggle} />
          <DateRangePicker className={styles.dateRangePicker} />
        </div>
      </div>

      <SleepSessionsGraph2D/>
    </div>
  )
}
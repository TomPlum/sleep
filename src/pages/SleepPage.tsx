import styles from './SleepPage.module.scss'
import { Spin } from 'antd'
import { GithubOutlined, LoadingOutlined } from '@ant-design/icons'
import { SleepSessionsGraph2D } from 'modules/graph/components/SleepSessionsGraph2D'
import { useSleepContext } from 'context'
import { useTranslation } from 'react-i18next'
import { useGraphStyles } from 'modules/graph/hooks/useGraphStyles'
import { GraphControls } from 'modules/controls/GraphControls'

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
            total: sleepData?.sessions.length,
            naps: sleepData?.sessions.filter(session => session.isNap).length
          })}
        </p>
      </div>

      <GraphControls className={styles.controls} />

      <SleepSessionsGraph2D/>
    </div>
  )
}
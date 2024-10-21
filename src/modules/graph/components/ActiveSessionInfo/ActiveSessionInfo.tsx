import { GithubOutlined } from '@ant-design/icons'
import styles from './ActiveSessionInfo.module.scss'
import { useGraphStyles } from 'modules/graph/hooks/useGraphStyles'
import { useTranslation } from 'react-i18next'
import { useSleepContext } from 'context'
import { ActiveSessionInfoProps } from './types'
import classNames from 'classnames'

export const ActiveSessionInfo = ({ className }: ActiveSessionInfoProps) => {
  const { activeSessions, sleepData, sleepMetric } = useSleepContext()
  const { currentMetricColour } = useGraphStyles({ metric: sleepMetric })
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d' })

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.top}>
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

      <a
        href='/PillowData.csv'
        download='PillowData.csv'
        title={t('data-source.title')}
        className={styles.dataExportVersion}
      >
        {t('data-source.name')}
      </a>
    </div>
  )
}
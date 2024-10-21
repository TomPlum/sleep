import { GithubOutlined } from '@ant-design/icons'
import styles from './ActiveSessionInfo.module.scss'
import { useGraphStyles } from 'modules/graph/hooks/useGraphStyles'
import { useTranslation } from 'react-i18next'
import { useSleepContext } from 'context'
import { ActiveSessionInfoProps } from './types'
import classNames from 'classnames'

export const ActiveSessionInfo = ({ className }: ActiveSessionInfoProps ) => {
  const { currentMetricColour } = useGraphStyles()
  const { activeSessions, sleepData } = useSleepContext()
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

      <p className={styles.dataExportVersion}>
        {t('data-source')}
      </p>
    </div>
  )
}
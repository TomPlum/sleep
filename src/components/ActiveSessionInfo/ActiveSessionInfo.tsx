import { GithubOutlined } from '@ant-design/icons'
import styles from './ActiveSessionInfo.module.scss'
import { useGraphStyles } from 'modules/MetricLineChart/hooks/useGraphStyles'
import { useTranslation } from 'react-i18next'
import { useSleepContext } from 'context/SleepContext'
import { ActiveSessionInfoProps } from './types'
import classNames from 'classnames'
import { CSSProperties, useMemo } from 'react'
import { PILLOW_DATABASE_FILE_NAME } from 'modules/DataWorker'

export const ActiveSessionInfo = ({ className }: ActiveSessionInfoProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d' })
  const { activeSessions, sleepData, stackedMetrics, stackedView, sleepMetric } = useSleepContext()

  const { currentMetricColour: firstColour } = useGraphStyles({
    metric: stackedView ? stackedMetrics[0] : sleepMetric
  })

  const { currentMetricColour: secondColour } = useGraphStyles({
    metric: stackedView ? stackedMetrics[ stackedMetrics.length > 1 ? 1 : 0] : sleepMetric
  })

  const linearGradient = useMemo<CSSProperties| undefined>(() => {
    if (!stackedView || stackedMetrics.length <= 1) {
      return {
        color: firstColour
      }
    }

    return {
      background: `linear-gradient(to right, ${firstColour}, ${secondColour})`,
      WebkitBackgroundClip: 'text',
      color: 'transparent'
    }
  }, [firstColour, secondColour, stackedMetrics.length, stackedView])

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.top}>
        <a href='https://github.com/TomPlum/sleep' rel='noreferrer'>
          <GithubOutlined
            className={styles.github}
          />
        </a>

        {(!stackedView || stackedMetrics.length > 0) && (
          <p className={styles.sessions}>
            <span style={{ color: firstColour }}>
              {activeSessions}
            </span>

              <span style={linearGradient}>
              {t('sessions.delimiter')}
            </span>

              <span style={{ color: secondColour }}>
              {sleepData?.sessions.length}
            </span>

              <span style={linearGradient}>
              {t('sessions.sessions')}
            </span>

              <span style={linearGradient}>
              {t('sessions.naps', {
                naps: sleepData?.sessions.filter(session => session.isNap).length
              })}
            </span>
          </p>
        )}

        {stackedView && stackedMetrics.length === 0 && (
          <p className={styles.sessions}>
            {t('sessions.please-select')}
          </p>
        )}
      </div>

      <div className={styles.bottom}>
        <a
          target='_blank'
          title='Sleep apps website'
          href='https://pillow.app/'
          className={styles.pillowLogo}
        >
          <img src={`${import.meta.env.BASE_URL}Pillow.png`} alt='Pillow Logo' />
        </a>

        <a
          title={t('data-source.title')}
          href={`/${PILLOW_DATABASE_FILE_NAME}`}
          download={PILLOW_DATABASE_FILE_NAME}
          className={styles.dataExportVersion}
        >
          {PILLOW_DATABASE_FILE_NAME}
        </a>
      </div>
    </div>
  )
}
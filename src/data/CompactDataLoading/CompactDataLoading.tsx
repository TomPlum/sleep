import { DataWorkerStatusCode, useEventListener } from 'modules/DataWorker'
import { useTranslation } from 'react-i18next'
import styles from './CompactDataLoading.module.scss'
import { Progress } from 'antd'
import { useMemo } from 'react'

export const CompactDataLoading = () => {
  const { status } = useEventListener()

  const  { t } = useTranslation('translation', { keyPrefix: 'loading' })

  const eventText = useMemo(() => {
    if (status.code === DataWorkerStatusCode.FINISHING) {
      return t('description.finishing')
    }

    return status.payload
  }, [status.code, status.payload, t])

  return (
    <div className={styles.loading}>
      <div className={styles.eventHistory}>
        <div className={styles.eventItem}>
            <span className={styles.eventName}>
              {t(`status.${status.code}`)}
            </span>

          <div className={styles.payloadInfo}>
              <span className={styles.payloadText}>
                {eventText}
              </span>
          </div>
        </div>

        {status.code === DataWorkerStatusCode.ASSOCIATE_SESSION_DATA && status.percent && (
          <Progress
            size='small'
            trailColor='#575757'
            strokeColor='#FFFFFF'
            className={styles.progress}
            percent={Math.round(status.percent)}
          />
        )}
      </div>
    </div>
  )
}
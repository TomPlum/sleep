import { useTranslation } from 'react-i18next'
import styles from './DataLoading.module.scss'
import { useSleepContext } from 'context'
import { useEffect, useState } from 'react'
import { DataWorkerStatusCode } from 'data/useDataWorker'
import { Progress } from 'antd'
import classNames from 'classnames'
import { CheckCircleOutlined } from '@ant-design/icons'

export const DataLoading = () => {
  const { dataWorkerStatus } = useSleepContext()

  const [history, setHistory] = useState<Partial<Record<DataWorkerStatusCode, string>>>({})
  const [currentOperation, setCurrentOperation] = useState<DataWorkerStatusCode>()

  const  { t } = useTranslation('translation', { keyPrefix: 'loading' })

  useEffect(() => {
    setCurrentOperation(dataWorkerStatus.statusCode)

    setHistory(current => {
      return {
        ...current,
        [dataWorkerStatus.statusCode]: dataWorkerStatus.payload
      }
    })
  }, [dataWorkerStatus])

  return (
    <div className={styles.loading}>
      <div className={styles.eventHistory}>
        {Object.keys(history).map((event, index) => (
          <div
            key={index}
            className={classNames(
              styles.eventItem,
              { [styles.activeOperation]: currentOperation === event }
            )}
          >
            <span className={styles.eventName}>
              {t(`status.${event}`)}

              {currentOperation === event && (
                '...'
              )}
            </span>

            <div className={styles.payloadInfo}>
              {currentOperation !== event && (
                <CheckCircleOutlined className={styles.done} />
              )}

              {currentOperation !== event && history[event as DataWorkerStatusCode] && (
                <span className={styles.payloadText}>
                  {history[event as DataWorkerStatusCode]}
                </span>
              )}
            </div>
          </div>
        ))}

        {currentOperation === DataWorkerStatusCode.SLEEP_STAGE_DATA && (
          <Progress
            size='small'
            strokeColor='#FFFFFF'
            trailColor='#575757'
            className={styles.progress}
            percent={Math.round(dataWorkerStatus.percent)}
          />
        )}
      </div>
    </div>
  )
}
import { useTranslation } from 'react-i18next'
import styles from './DataLoading.module.scss'
import { useEffect, useState } from 'react'
import { DataWorkerStatusCode } from 'data/useDataWorker'
import { Progress, Spin } from 'antd'
import classNames from 'classnames'
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { useDataWorkerEventListener } from 'data/useDataWorker/useDataWorkerEventListener'

export const DataLoading = () => {
  const { status } = useDataWorkerEventListener()

  const [history, setHistory] = useState<Partial<Record<DataWorkerStatusCode, string>>>({})
  const [currentOperation, setCurrentOperation] = useState<DataWorkerStatusCode>()

  const  { t } = useTranslation('translation', { keyPrefix: 'loading' })

  useEffect(() => {
    setCurrentOperation(status.statusCode)
    
    setHistory(current => {
      return {
        ...current,
        [status.statusCode]: status.payload
      }
    })
  }, [status])

  return (
    <div className={styles.loading}>
      <div className={styles.eventHistory}>
        {Object.keys(history).map((event, index) => (
          <div
            key={index}
            className={classNames(
              styles.eventItem,
              { [styles.historicalOperation]: currentOperation !== event }
            )}
          >
            <span className={classNames(
              styles.eventName,
              { [styles.activeOperation]: currentOperation === event }
            )}>
              {t(`status.${event}`)}
            </span>

            <div className={styles.payloadInfo}>
              {currentOperation !== event && (
                <CheckCircleOutlined className={styles.done} />
              )}

              {currentOperation === event && (
                <Spin
                  size="small"
                  className={styles.spinner}
                  indicator={<LoadingOutlined spin />}
                />
              )}

              {history[event as DataWorkerStatusCode] && (
                <span className={styles.payloadText}>
                  {history[event as DataWorkerStatusCode]}
                </span>
              )}
            </div>
          </div>
        ))}

        {currentOperation === DataWorkerStatusCode.ASSOCIATE_SESSION_DATA && (
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
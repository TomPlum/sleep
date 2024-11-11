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

  const [history, setHistory] = useState<Set<DataWorkerStatusCode>>(new Set())
  const [currentOperation, setCurrentOperation] = useState<DataWorkerStatusCode>()

  const  { t } = useTranslation('translation', { keyPrefix: 'loading' })

  useEffect(() => {
    setCurrentOperation(dataWorkerStatus.statusCode)

    if (![...history].includes(dataWorkerStatus.statusCode)) {
      setHistory(current => {
        return new Set([...current, dataWorkerStatus.statusCode])
      })
    }
  }, [history, dataWorkerStatus])

  return (
    <div className={styles.loading}>
      <div className={styles.eventHistory}>
        {[...history].map((event, index) => (
          <div
            key={index}
            className={classNames(
              styles.eventItem,
              { [styles.activeOperation]: currentOperation === event }
            )}
          >
            {t(`status.${event}`)}

            {currentOperation === event && (
              '...'
            )}

            {currentOperation !== event && (
              <CheckCircleOutlined className={styles.done} />
            )}
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
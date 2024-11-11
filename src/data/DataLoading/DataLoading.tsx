import { useTranslation } from 'react-i18next'
import styles from './DataLoading.module.scss'
import { Progress } from 'antd'
import { useSleepContext } from 'context'
import { useMemo } from 'react'
import { DataWorkerStatus } from 'data/useDataWorker/worker'

export const DataLoading = () => {
  const { dataWorkerStatus } = useSleepContext()
  const  { t } = useTranslation('translation', { keyPrefix: 'loading' })

  const percent = useMemo<number>(() => {
    switch (dataWorkerStatus) {
      case DataWorkerStatus.NOT_STARTED: {
        return 0
      }
      case DataWorkerStatus.STARTING: {
        return 5
      }
      case DataWorkerStatus.SLEEP_STAGE_DATA: {
        return 45
      }
      case DataWorkerStatus.SOUND_DATA: {
        return 85
      }
      case DataWorkerStatus.FINISHING: {
        return 95
      }
      case DataWorkerStatus.DONE: {
        return 100
      }
      case DataWorkerStatus.ERROR: {
        return 100
      }
    }
  }, [dataWorkerStatus])

  return (
    <div className={styles.loading}>
      <p>
        {t(dataWorkerStatus)}
      </p>

      <Progress
        size={[400, 20]}
        percent={percent}
        percentPosition={{ align: 'center', type: 'inner' }}
      />
    </div>
  )
}
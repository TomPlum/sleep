import { useTranslation } from 'react-i18next'
import styles from './DataLoading.module.scss'
import { Progress } from 'antd'
import { useSleepContext } from 'context'
import { useMemo } from 'react'

export const DataLoading = () => {
  const { dataWorkerStatus } = useSleepContext()
  const  { t } = useTranslation('translation', { keyPrefix: 'loading' })

  const status = useMemo(() => {
    if (dataWorkerStatus) {
      return t(`status.${dataWorkerStatus.statusCode}`)
    }

    return t('status.unknown')
  }, [t, dataWorkerStatus])

  return (
    <div className={styles.loading}>
      <p className={styles.status}>
        {status}
      </p>

      <Progress
        size={[400, 20]}
        percent={Math.round(dataWorkerStatus.percent)}
        percentPosition={{ align: 'center', type: 'inner' }}
      />
    </div>
  )
}
import { useTranslation } from 'react-i18next'
import styles from './DataLoading.module.scss'
import { Progress } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import { useRawSleepData } from 'data/useRawSleepData'
import { RawSleepDataLoadEvent } from 'data/useRawSleepData/types'

export const DataLoading = () => {
  const [started, setStarted] = useState(false)
  const [animating, setAnimating] = useState(false)

  const [line, setLine] = useState(0)
  const [percentage, setPercentage] = useState(0)

  const  { t } = useTranslation('translation', { keyPrefix: 'loading' })

  const handleSleepDataLoadEvent = useCallback((event: RawSleepDataLoadEvent) => {
    // console.log(JSON.stringify(event))
    setPercentage(event.percentage)
    console.log(event.line)
    setLine(event.line)
  }, [])
  console.log(percentage)

  const { loading } = useRawSleepData({})

/*  useEffect(() => {
    const animate = () => {
      setTimeout(() => {
        setStarted(true)
        setAnimating(true)
      }, 500)

      setTimeout(() => {
        setAnimating(false)
      }, 2000)
    }

    animate()

    return animate
  }, [])*/

  return (
    <div className={styles.loading}>
      <div className={styles.title}>
        <p className={styles.start}>
          {t('title.start')}
        </p>

        {(!started || animating) && (
          <p className={classNames(styles.apnea, { [styles.strike]: animating })}>
            {t('title.apnea')}
          </p>
        )}

        {started && !animating && (
          <p className={styles.app}>
            {t('title.app')}
          </p>
        )}
      </div>

      <p>
        {loading.line}
      </p>

      <Progress
        size={[400, 20]}
        percent={loading.percent}
        percentPosition={{ align: 'center', type: 'inner' }}
      />
    </div>
  )
}
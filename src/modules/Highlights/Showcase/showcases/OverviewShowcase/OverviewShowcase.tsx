import { useTranslation } from 'react-i18next'
import { useSleepContext } from 'context/SleepContext'
import { Typography } from 'antd'
import { useEffect, useMemo } from 'react'
import { formatDuration } from 'utils/formatDuration'
import styles from './OverviewShowcase.module.scss'
import { useShowcaseContext } from 'modules/Highlights/Showcase/context'

export const OverviewShowcase = () => {
  const { onEnd } = useShowcaseContext()
  const { sleepData } = useSleepContext()
  const { t } = useTranslation('translation', { keyPrefix: 'highlights.showcases.overview' })

  useEffect(() => {
    // Do some animation over time, then finish
    setTimeout(() => {
      console.log('Calling onEnd() from OverviewShowcase')
      onEnd()
    }, 3000)
  }, [onEnd])

  const totalTimeSlept = useMemo<string>(() => {
    const minutes = sleepData?.sessions.reduce<number>((minutesSlept, session) => {
      return minutesSlept + session.duration.total
    }, 0) ?? 0

    return formatDuration(Math.round(minutes))
  }, [sleepData?.sessions])

  return (
    <div className={styles.showcase}>
      <Typography>
        {t('total-sessions', { total: sleepData?.sessions.length })}
      </Typography>

      <Typography>
        {t('total-time-slept', { time: totalTimeSlept })}
      </Typography>
    </div>
  )
}
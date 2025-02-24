import { useTranslation } from 'react-i18next'
import { useSleepContext } from 'context/SleepContext'
import { Typography } from 'antd'
import { useMemo } from 'react'
import { formatDuration } from 'utils/formatDuration'

export const OverviewShowcase = () => {
  const { sleepData } = useSleepContext()
  const { t } = useTranslation('translation', { keyPrefix: 'highlights.showcases.overview' })

  const totalTimeSlept = useMemo<string>(() => {
    const minutes = sleepData?.sessions.reduce<number>((minutesSlept, session) => {
      return minutesSlept + session.duration.total
    }, 0) ?? 0

    return formatDuration(Math.round(minutes))
  }, [sleepData?.sessions])

  return (
    <div>
      <Typography>
        {t('total-sessions', { total: sleepData?.sessions.length })}
      </Typography>

      <Typography>
        {t('total-time-slept', { time: totalTimeSlept })}
      </Typography>
    </div>
  )
}
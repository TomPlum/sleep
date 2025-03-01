import { useSleepContext } from 'context/SleepContext'
import { useMemo } from 'react'
import styles from './WakeupShowcase.module.scss'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { isValidSession } from 'data/isValidSession'

export const WakeupShowcase = () => {
  const { sleepData } = useSleepContext()
  const { t } = useTranslation('translation', { keyPrefix: 'highlights.showcases.wakeup' })

  const averageEndTimes = useMemo(() => {
    const sleepSessions = sleepData?.sessions.filter(session => {
      const notNap = !session.isNap
      const isValid = isValidSession({
        isNap: session.isNap,
        duration: session.duration
      })

      return notNap && isValid
    }) ?? []

    const groupedByYear: Record<number, number[]> = {}

    sleepSessions.forEach(session => {
      const year = session.endTime.getFullYear()

      // Convert end time to minutes from midnight
      const hours = session.endTime.getHours()
      const minutes = session.endTime.getMinutes()
      const totalMinutes = hours * 60 + minutes

      if (!groupedByYear[year]) {
        groupedByYear[year] = []
      }

      groupedByYear[year].push(totalMinutes)
    })

    return Object.entries(groupedByYear).map(([year, minutesList]) => {
      const avgMinutes = minutesList.reduce((sum, mins) => sum + mins, 0) / minutesList.length
      const avgHours = Math.floor(avgMinutes / 60)
      const avgMins = Math.round(avgMinutes % 60)

      return {
        year: Number(year),
        averageTime: `${String(avgHours).padStart(2, '0')}:${String(avgMins).padStart(2, '0')}`
      }
    })

  }, [sleepData?.sessions])

  return (
    <div className={styles.showcase}>
      <Typography className={styles.averageWakeupText}>
        {t('average-wakeup')}
      </Typography>

      {averageEndTimes.map(({ year, averageTime }) => (
        <Typography key={year} className={styles.averageWakeUpTime}>
          {year}:
          {' '}
          {averageTime}
        </Typography>
      ))}
    </div>
  )
}
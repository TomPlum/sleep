import { useSleepContext } from 'context/SleepContext'
import { useEffect, useMemo, useState } from 'react'
import styles from './WakeupShowcase.module.scss'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { isValidSession } from 'data/isValidSession'
import { LakesideSunrise } from 'modules/Highlights/components/LakesideSunrise'
import { useShowcaseContext } from 'modules/Highlights/Showcase/context'

export const WakeupShowcase = () => {
  const { onEnd } = useShowcaseContext()
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

  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    setInterval(() => {
      const nextIndex = currentTime + 1
      if (averageEndTimes[nextIndex]) {
        setCurrentTime(nextIndex)
      } else {
        // onEnd()
      }
    }, 2000)
  }, [averageEndTimes, currentTime, onEnd])

  return (
    <div className={styles.showcase}>
      <LakesideSunrise />

      <div className={styles.content}>
        <div className={styles.averageWakeupText}>
          <Typography className={styles.averageWakeupText1}>
            {t('average-wakeup1')}
          </Typography>

          <Typography className={styles.averageWakeupText2}>
            {t('average-wakeup2')}
          </Typography>

          <Typography className={styles.averageWakeupYear}>
            {averageEndTimes[currentTime].year}
          </Typography>

          <Typography className={styles.averageWakeupText3}>
            {t('average-wakeup3')}
          </Typography>
        </div>

        <Typography className={styles.averageWakeUpTime}>
          {averageEndTimes[currentTime].averageTime}
        </Typography>

        <Typography className={styles.averageWakeUpTimeReflection}>
          {averageEndTimes[currentTime].averageTime}
        </Typography>
      </div>
    </div>
  )
}
import { useSleepContext } from 'context/SleepContext'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './WakeupShowcase.module.scss'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { isValidSession } from 'data/isValidSession'
import { LakesideSunrise } from 'modules/Highlights/components/LakesideSunrise'
import { useShowcaseContext } from 'modules/Highlights/Showcase/context'
import { WAKEUP_SHOWCASE_YEAR_INTERVAL } from './types'
import { useMediaQuery } from '@uidotdev/usehooks'
import { ShowcaseProgressDots } from 'modules/Highlights/components/ShowcaseProgressDots'

export const WakeupShowcase = () => {
  const { onEnd } = useShowcaseContext()
  const { sleepData } = useSleepContext()
  const isMobile = useMediaQuery('only screen and (max-width : 768px)')

  const [currentTime, setCurrentTime] = useState(0)
  const interval = useRef<NodeJS.Timeout | null>(null)
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

  useEffect(() => {
    interval.current = setInterval(() => {
      const nextIndex = currentTime + 1
      console.log('nextIndex', nextIndex)
      if (averageEndTimes[nextIndex]) {
        setCurrentTime(nextIndex)
      } else {
        // onEnd()
      }
    }, WAKEUP_SHOWCASE_YEAR_INTERVAL)
  }, [averageEndTimes, currentTime, onEnd])

  const handleClickDot = useCallback((dotIndex: number) => {
    setCurrentTime(dotIndex)

    if (interval.current) {
      clearInterval(interval.current)
      interval.current = null
    }
  }, [])

  return (
    <div className={styles.showcase}>
      <LakesideSunrise />

      <div className={styles.content}>
        <div className={styles.times}>
          <div className={styles.left}>
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
          </div>

          <ShowcaseProgressDots
            active={currentTime}
            className={styles.dots}
            onClickDot={handleClickDot}
            dots={averageEndTimes.length}
            orientation={isMobile ? 'horizontal' : 'vertical'}
          />
        </div>

        <div className={styles.reflectedTime}>
          <Typography className={styles.averageWakeUpTimeReflection}>
            {averageEndTimes[currentTime].averageTime}
          </Typography>
        </div>
      </div>
    </div>
  )
}
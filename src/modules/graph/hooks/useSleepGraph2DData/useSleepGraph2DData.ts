import { useCallback, useMemo } from 'react'
import type { SleepSessionGraph2DData } from 'modules/graph/components/SleepSessionsGraph2D'
import dayjs from 'dayjs'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { SleepGraph2DDataProps, SleepGraph2DDataResponse } from 'modules/graph/hooks/useSleepGraph2DData/types'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

export const useSleepGraph2DData = ({
  sessions,
  isSleepDataLoading,
  rangeStart,
  rangeEnd,
  includeNaps
}: SleepGraph2DDataProps): SleepGraph2DDataResponse => {
  const toPercentage = useCallback((duration: number, total: number) => {
    return (duration / total) * 100
  }, [])

  const data = useMemo<SleepSessionGraph2DData>(() => {
    return sessions.map(session => {
      const duration = session.duration
      const totalDuration = duration.total

      return {
        xDate: session.startTime.getTime(),
        date: session.startTime,
        duration: totalDuration,
        isNap: session.isNap,
        [SleepMetric.QUALITY]: session.sleepQuality,
        [SleepMetric.AWAKE_TIME]: toPercentage(duration.awake, totalDuration),
        [SleepMetric.DEEP_SLEEP]: toPercentage(duration.deep, totalDuration),
        [SleepMetric.REM_SLEEP]: toPercentage(duration.rem, totalDuration),
        [SleepMetric.LIGHT_SLEEP]: toPercentage(duration.light, totalDuration),
        [SleepMetric.DURATION]: toPercentage(totalDuration, 8 * 60)
      }
    }).filter(({ date, isNap }) => {
      const isWithinDateRange = dayjs(date).isBetween(dayjs(rangeStart), dayjs(rangeEnd), 'day', '[]')
      const isNapIncluded = isNap ? includeNaps : true
      return isWithinDateRange && isNapIncluded
    })
  }, [toPercentage, rangeEnd, rangeStart, sessions, includeNaps])

  const { earliestSession, latestSession } = useMemo(() => {
    const earliestSession = new Date(Math.min(...data.map(session => session.date.getTime())))
    const latestSession = new Date(Math.max(...data.map(session => session.date.getTime())))
    return {
      earliestSession,
      latestSession
    }
  }, [data])
console.log(data)
  return {
    data,
    latestSession,
    earliestSession,
    isSleepDataLoading
  }
}
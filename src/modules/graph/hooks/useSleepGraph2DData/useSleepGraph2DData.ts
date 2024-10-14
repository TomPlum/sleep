import {useCallback, useMemo} from "react";
import type {SleepSessionGraph2DData} from "modules/graph/components/SleepSessionsGraph2D";
import dayjs from "dayjs";
import {SleepMetric} from "modules/controls/MetricConfiguration";
import {useSleepContext} from "context";
import {SleepGraph2DDataProps, SleepGraph2DDataResponse} from "modules/graph/hooks/useSleepGraph2DData/types.ts";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

export const useSleepGraph2DData = ({ rangeStart, rangeEnd }: SleepGraph2DDataProps): SleepGraph2DDataResponse => {
  const { sleepData, isSleepDataLoading } = useSleepContext()

  const toPercentage = useCallback((duration: number, total: number) => {
    return (duration / total) * 100
  }, [])

  const data = useMemo<SleepSessionGraph2DData>(() => {
    return sleepData?.sessions.map(session => {
      const duration = session.duration
      const totalDuration = duration.total

      return {
        _date: dayjs(session.startTime).format('MMM YY'),
        date: session.startTime,
        [SleepMetric.QUALITY]: session.sleepQuality,
        [SleepMetric.AWAKE_TIME]: toPercentage(duration.awake, totalDuration),
        [SleepMetric.DEEP_SLEEP]: toPercentage(duration.deep, totalDuration),
        [SleepMetric.REM_SLEEP]: toPercentage(duration.rem, totalDuration),
        [SleepMetric.LIGHT_SLEEP]: toPercentage(duration.light, totalDuration)
      }
    }).filter(({ date }) => {
      return dayjs(date).isBetween(dayjs(rangeStart), dayjs(rangeEnd), 'day', '[]')
    })
  }, [toPercentage, rangeEnd, rangeStart, sleepData?.sessions])

  return {
    data,
    isSleepDataLoading
  }
}
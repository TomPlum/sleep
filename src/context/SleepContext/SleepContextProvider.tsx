import { SleepContext } from 'context/SleepContext/SleepContext'
import { PropsWithChildren, useEffect, useMemo } from 'react'
import { SleepContextBag } from 'context/SleepContext/types'
import { useSleepGraph2DData } from 'modules/MetricLineChart/hooks/useSleepGraph2DData'
import { useDefaultQueryParams } from 'hooks/useDefaultQueryParams'
import { useRawSleepData } from 'data/useRawSleepData'
import { useChartConfigContext } from 'context/ChartConfigContext'
import { useQueryParams } from 'hooks/useQueryParams'
import dayjs from 'dayjs'
import { PageRoutes } from 'routes.ts'

export const SleepContextProvider = ({ children }: PropsWithChildren) => {
  const { sleepData, sessionStages, sessionSounds, loading } = useRawSleepData()

  const { selected } = useDefaultQueryParams()
  const { updateQueryParam } = useQueryParams()
  const { rangeStart, rangeEnd, setRangeStart, setRangeEnd } = useChartConfigContext()

  useEffect(() => {
    if (!rangeStart && !rangeEnd && sleepData?.latestSession && !loading) {
      const latestSession = sleepData.latestSession
      const twoMonthsBeforeLatestSession = dayjs(latestSession).subtract(2, 'months').toDate()

      setRangeStart(twoMonthsBeforeLatestSession)
      setRangeEnd(latestSession)

      updateQueryParam({
        route: PageRoutes.SLEEP,
        params: {
          start: twoMonthsBeforeLatestSession.getTime().toString(),
          end: latestSession?.getTime().toString()
        }
      })
    }
  }, [loading, rangeEnd, rangeStart, setRangeEnd, setRangeStart, sleepData?.latestSession, updateQueryParam])

  const sleepGraphData2d = useSleepGraph2DData({
    sessions: sleepData?.sessions ?? [],
    rangeStart: rangeStart ?? new Date(),
    rangeEnd: rangeEnd ?? new Date(),
    isSleepDataLoading: loading,
    includeNaps: false
  })

  const improvementDate = sleepGraphData2d.data.find(({ date }) => {
    return date.getFullYear() === 2024 && date.getMonth() === 8 && date.getDate() === 6
  })?.date

  const value = useMemo<SleepContextBag>(() => ({
    sleepData,
    sleepStageData: sessionStages,
    sleepSoundData: sessionSounds,
    isSleepDataLoading: loading,
    selectedSession: selected,
    graphData2d: sleepGraphData2d ?? { data: [], isSleepDataLoading : true },
    activeSessions: sleepGraphData2d?.data?.length ?? 0,
    improvementDate
  }), [improvementDate, loading, selected, sessionSounds, sessionStages, sleepData, sleepGraphData2d])

  return (
    <SleepContext.Provider value={value}>
      {children}
    </SleepContext.Provider>
  )
}
import {SleepContext} from "context/SleepContext.ts";
import {PropsWithChildren, useEffect, useMemo, useState} from "react";
import {SleepContextBag} from "context/types.ts";
import {useSleepData} from "data/useSleepData";
import {useQueryParams} from "hooks/useQueryParams";
import {SleepMetric} from "modules/controls/MetricConfiguration";
import dayjs from "dayjs";
import {useSleepGraph2DData} from "modules/graph/hooks/useSleepGraph2DData";

export const SleepContextProvider = ({ children }: PropsWithChildren) => {
  const { sleepData, loading } = useSleepData()
  const { queryParams: { start, end, metric }, updateQueryParam } = useQueryParams()

  const [rangeEnd, setRangeEnd] = useState(end)
  const [rangeStart, setRangeStart] = useState(start)
  const [currentMetric, setCurrentMetric] = useState(metric)

  const sleepGraphData2d = useSleepGraph2DData({
    sleepData,
    isSleepDataLoading: loading,
    rangeStart: rangeStart ?? new Date(),
    rangeEnd: rangeEnd ?? new Date()
  })

  useEffect(() => {
    if (!loading && sleepData && (!rangeStart || !rangeEnd || !currentMetric)) {
      const selectedMetric = currentMetric ?? SleepMetric.QUALITY
      setCurrentMetric(selectedMetric)

      const selectedStart = rangeStart ?? dayjs(sleepData.latestSession).subtract(2, 'month').toDate()
      setRangeStart(selectedStart)

      const selectedEnd = rangeEnd ?? sleepData.latestSession
      setRangeEnd(selectedEnd)

      const params: Record<string, string> = {
        metric: selectedMetric,
        start: selectedStart.getTime().toString(),
        end: selectedEnd.getTime().toString()
      }

      updateQueryParam({ route: '/sleep', params})
    }
  }, [currentMetric, loading, rangeEnd, rangeStart, sleepData, updateQueryParam])

  const value = useMemo<SleepContextBag>(() => ({
    sleepData,
    isSleepDataLoading: loading,
    rangeStart: rangeStart ?? new Date(),
    setRangeStart,
    rangeEnd: rangeEnd ?? new Date(),
    setRangeEnd,
    sleepMetric: currentMetric ?? SleepMetric.QUALITY,
    setSleepMetric: setCurrentMetric,
    graphData2d: sleepGraphData2d ?? { data: [], isSleepDataLoading : true },
    activeSessions: sleepGraphData2d?.data?.length ?? 0
  }), [currentMetric, sleepGraphData2d, loading, rangeEnd, rangeStart, sleepData])

  return (
    <SleepContext.Provider value={value}>
      {children}
    </SleepContext.Provider>
  )
}
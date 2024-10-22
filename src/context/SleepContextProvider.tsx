import { SleepContext } from 'context/SleepContext'
import { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { SleepContextBag } from 'context/types'
import { useSleepData } from 'data/useSleepData'
import { useQueryParams } from 'hooks/useQueryParams'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import dayjs from 'dayjs'
import { useSleepGraph2DData } from 'modules/graph/hooks/useSleepGraph2DData'
import { PageRoutes } from 'routes'
import { useTranslation } from 'react-i18next'

export const SleepContextProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useTranslation()
  const { sleepData, loading } = useSleepData()
  const { queryParams: { start, end, metric, lng, stacked }, updateQueryParam } = useQueryParams()

  const [language, setLanguage] = useState(lng)
  const [rangeEnd, setRangeEnd] = useState(end)
  const [rangeStart, setRangeStart] = useState(start)
  const [currentMetric, setCurrentMetric] = useState(metric)

  const [stackedView, setStackedView] = useState(stacked)
  const [stackedMetrics, setStackedMetrics] = useState<SleepMetric[]>([])

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

  useEffect(() => {
    if (!loading && sleepData && (!rangeStart || !rangeEnd || !currentMetric || !lng || stackedView === undefined)) {
      const selectedMetric = currentMetric ?? SleepMetric.QUALITY
      setCurrentMetric(selectedMetric)

      const selectedStart = rangeStart ?? dayjs(sleepData.latestSession).subtract(2, 'month').toDate()
      setRangeStart(selectedStart)

      const selectedEnd = rangeEnd ?? sleepData.latestSession
      setRangeEnd(selectedEnd)

      const selectedLanguage = language ?? 'en'
      setLanguage(selectedLanguage)

      const selectedStackedView = stackedView !== undefined ? stackedView : false
      setStackedView(selectedStackedView)

      const params: Record<string, string> = {
        metric: selectedMetric,
        start: selectedStart.getTime().toString(),
        end: selectedEnd.getTime().toString(),
        lng: selectedLanguage,
        stacked: String(selectedStackedView)
      }

      updateQueryParam({ route: PageRoutes.SLEEP, params })
    }
  }, [currentMetric, language, lng, loading, rangeEnd, rangeStart, sleepData, stackedView, updateQueryParam])

  useEffect(() => {
    i18n.changeLanguage(language).then(() => {
      console.debug(`Set locale [${language}] from query parameters.`)
    })
  }, [i18n, language])

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
    activeSessions: sleepGraphData2d?.data?.length ?? 0,
    improvementDate,
    stackedView: stackedView ?? false,
    setStackedView,
    stackedMetrics,
    setStackedMetrics
  }), [sleepData, loading, rangeStart, rangeEnd, currentMetric, sleepGraphData2d, improvementDate, stackedView, stackedMetrics])

  return (
    <SleepContext.Provider value={value}>
      {children}
    </SleepContext.Provider>
  )
}
import { SetStateAction, useCallback, useEffect, useState } from 'react'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { PageRoutes } from 'routes.ts'
import { useQueryParams } from 'hooks/useQueryParams'
import { DefaultQueryParamsProps } from './types'

export const useDefaultQueryParams = ({ loading, sleepData }: DefaultQueryParamsProps) => {
  const { queryParams: { start, end, metric, lng, stacked, metrics, selected }, updateQueryParam } = useQueryParams()

  const [language, setLanguage] = useState(lng)
  const [rangeEnd, setRangeEnd] = useState(end)
  const [rangeStart, setRangeStart] = useState(start)
  const [currentMetric, setCurrentMetric] = useState(metric)

  const [stackedView, setStackedView] = useState(stacked)
  const [stackedMetrics, setStackedMetrics] = useState(metrics)

  useEffect(() => {
    if (!loading && sleepData && (!rangeStart || !rangeEnd || !currentMetric || !lng || stackedView === undefined || !stackedMetrics)) {
      const selectedMetric = currentMetric ?? SleepMetric.QUALITY
      setCurrentMetric(selectedMetric)

      const selectedStart = rangeStart ?? sleepData.earliestSession
      setRangeStart(selectedStart)

      const selectedEnd = rangeEnd ?? sleepData.latestSession
      setRangeEnd(selectedEnd)

      const selectedLanguage = language ?? 'en'
      setLanguage(selectedLanguage)

      const selectedStackedView = stackedView !== undefined ? stackedView : false
      setStackedView(selectedStackedView)

      const selectedStackedMetrics = stackedMetrics ?? []
      setStackedMetrics(selectedStackedMetrics)

      const params: Record<string, string> = {
        metric: selectedMetric,
        start: selectedStart.getTime().toString(),
        end: selectedEnd.getTime().toString(),
        lng: selectedLanguage,
        stacked: String(selectedStackedView)
      }

      updateQueryParam({ route: PageRoutes.SLEEP, params })
    }
  }, [currentMetric, language, lng, loading, rangeEnd, rangeStart, sleepData, stackedMetrics, stackedView, updateQueryParam])

  const handleSetStackedMetrics = useCallback((setState: SetStateAction<SleepMetric[]>) => {
    setStackedMetrics(existing => {
      if (typeof setState === 'function') {
        return (setState as (existing: SleepMetric[] | undefined) => SleepMetric[])(existing)
      }

      return setState
    })
  }, [])

  return {
    language,
    rangeStart,
    rangeEnd,
    currentMetric,
    stackedView,
    stackedMetrics,
    setRangeStart,
    setRangeEnd,
    setCurrentMetric,
    setStackedView,
    handleSetStackedMetrics,
    selected
  }
}
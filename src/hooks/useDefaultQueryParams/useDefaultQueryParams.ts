import { SetStateAction, useCallback, useEffect, useState } from 'react'
import { SleepMetric } from 'modules/ChartControls'
import { PageRoutes } from 'routes'
import { useQueryParams } from 'hooks/useQueryParams'

export const useDefaultQueryParams = () => {
  const { queryParams: { start, end, metric, lng, stacked, metrics, selected }, updateQueryParam } = useQueryParams()

  const [language, setLanguage] = useState(lng)
  const [rangeEnd, setRangeEnd] = useState(end)
  const [rangeStart, setRangeStart] = useState(start)
  const [currentMetric, setCurrentMetric] = useState(metric)

  const [stackedView, setStackedView] = useState(stacked)
  const [stackedMetrics, setStackedMetrics] = useState(metrics)

  useEffect(() => {
    if (!rangeStart || !rangeEnd || !currentMetric || !lng || stackedView === undefined || !stackedMetrics) {
      const selectedMetric = currentMetric ?? SleepMetric.QUALITY
      setCurrentMetric(selectedMetric)

      const selectedStart = rangeStart ?? new Date()
      setRangeStart(selectedStart)

      const selectedEnd = rangeEnd ?? new Date()
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
  }, [currentMetric, language, lng, rangeEnd, rangeStart, stackedMetrics, stackedView, updateQueryParam])

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
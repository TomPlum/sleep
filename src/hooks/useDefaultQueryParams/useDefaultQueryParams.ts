import { SetStateAction, useCallback, useEffect, useState } from 'react'
import { SleepMetric } from 'modules/ChartControls'
import { PageRoutes } from 'routes'
import { useQueryParams } from 'hooks/useQueryParams'
import { ChartView } from 'modules/ChartControls/components/ChartViewSelector/types'

export const useDefaultQueryParams = () => {
  const { queryParams: { start, end, metric, lng, metrics, selected, view }, updateQueryParam } = useQueryParams()

  const [language, setLanguage] = useState(lng)
  const [rangeEnd, setRangeEnd] = useState(end)
  const [rangeStart, setRangeStart] = useState(start)
  const [currentMetric, setCurrentMetric] = useState(metric)

  const [chartView, setChartView] = useState(view)
  const [stackedMetrics, setStackedMetrics] = useState(metrics)

  useEffect(() => {
    if (!rangeStart || !rangeEnd || !currentMetric || !lng || !stackedMetrics || !chartView) {
      const selectedMetric = currentMetric ?? SleepMetric.QUALITY
      setCurrentMetric(selectedMetric)

      const selectedStart = rangeStart ?? new Date()
      setRangeStart(selectedStart)

      const selectedEnd = rangeEnd ?? new Date()
      setRangeEnd(selectedEnd)

      const selectedLanguage = language ?? 'en'
      setLanguage(selectedLanguage)

      const selectedStackedMetrics = stackedMetrics ?? []
      setStackedMetrics(selectedStackedMetrics)

      const selectedChartView = chartView ?? ChartView.SINGLE_METRIC
      setChartView(selectedChartView)

      const params: Record<string, string> = {
        metric: selectedMetric,
        start: selectedStart.getTime().toString(),
        end: selectedEnd.getTime().toString(),
        lng: selectedLanguage,
        view: selectedChartView
      }

      updateQueryParam({ route: PageRoutes.SLEEP, params })
    }
  }, [chartView, currentMetric, language, lng, rangeEnd, rangeStart, stackedMetrics, updateQueryParam])

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
    stackedMetrics,
    setRangeStart,
    setRangeEnd,
    setCurrentMetric,
    handleSetStackedMetrics,
    selected,
    chartView,
    setChartView
  }
}
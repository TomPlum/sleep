import { SetStateAction, useCallback, useEffect, useState } from 'react'
import { SleepMetric } from 'modules/ChartControls'
import { PageRoutes } from 'routes'
import { useQueryParams } from 'hooks/useQueryParams'
import { ChartView } from 'modules/ChartControls/components/ChartViewSelector/types'

export const useDefaultQueryParams = () => {
  const { queryParams: { start, end, metric, lng, metrics, selected, view, is3D }, updateQueryParam } = useQueryParams()

  const [language, setLanguage] = useState(lng)
  const [rangeEnd, setRangeEnd] = useState(end)
  const [rangeStart, setRangeStart] = useState(start)
  const [currentMetric, setCurrentMetric] = useState(metric)
  const [is3dActive, setIs3DActive] = useState(is3D)
  const [chartView, setChartView] = useState(view)
  const [activeMetrics, setActiveMetrics] = useState(metrics)

  useEffect(() => {
    // If any of the query parameters are undefined in their respective state hooks,
    // it means the query parameter was missing from the URL when the page was loaded.
    // Here we set them to sensible defaults if possible.

    if (!rangeStart || !rangeEnd || !currentMetric || !lng || !activeMetrics || !chartView || is3dActive === undefined) {
      const selectedMetric = currentMetric ?? SleepMetric.QUALITY
      setCurrentMetric(selectedMetric)

      setRangeStart(rangeStart)
      setRangeEnd(rangeEnd)

      const selectedLanguage = language ?? 'en'
      setLanguage(selectedLanguage)

      const selectedStackedMetrics = activeMetrics ?? []
      setActiveMetrics(selectedStackedMetrics)

      const selectedChartView = chartView ?? ChartView.SINGLE_METRIC
      setChartView(selectedChartView)

      const selectedIs3DActive = is3dActive !== undefined ? is3dActive : false
      setIs3DActive(selectedIs3DActive)

      const params: Record<string, string> = {
        metric: selectedMetric,
        lng: selectedLanguage,
        view: selectedChartView,
        is3D: String(selectedIs3DActive)
      }

      // If there's no date range query params, then we can't default to anything
      // since we don't know what the date range of the available data is. If it's
      // not passed, it'll be updated once the data is loaded.
      if (rangeStart) {
        params.start = rangeStart.getTime().toString()
      }

      if (rangeEnd) {
        params.end = rangeEnd.getTime().toString()
      }

      updateQueryParam({ route: PageRoutes.SLEEP, params })
    }
  }, [chartView, currentMetric, language, lng, rangeEnd, rangeStart, activeMetrics, updateQueryParam, is3dActive])

  const handleSetStackedMetrics = useCallback((setState: SetStateAction<SleepMetric[]>) => {
    setActiveMetrics(existing => {
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
    activeMetrics,
    setRangeStart,
    setRangeEnd,
    setCurrentMetric,
    handleSetStackedMetrics,
    selected,
    chartView,
    setChartView,
    is3dActive,
    setIs3DActive
  }
}
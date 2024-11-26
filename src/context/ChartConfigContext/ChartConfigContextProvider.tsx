import { ChartConfigContext } from './ChartConfigContext'
import { PropsWithChildren, useEffect, useMemo } from 'react'
import { ChartConfigContextBag } from './types'
import { useDefaultQueryParams } from 'hooks/useDefaultQueryParams'
import { SleepMetric } from 'modules/ChartControls'
import { useTranslation } from 'react-i18next'
import { ChartView } from 'modules/ChartControls/components/ChartViewSelector/types'

export const ChartConfigContextProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useTranslation()

  const {
    currentMetric,
    rangeStart,
    rangeEnd,
    language,
    activeMetrics,
    setCurrentMetric,
    setRangeEnd,
    setRangeStart,
    handleSetStackedMetrics,
    chartView,
    setChartView
  } = useDefaultQueryParams()

  useEffect(() => {
    i18n.changeLanguage(language).then(() => {
      console.debug(`Set locale [${language}] from query parameters.`)
    })
  }, [i18n, language])

  const value = useMemo<ChartConfigContextBag>(() => ({
    rangeStart: rangeStart ?? new Date(),
    setRangeStart,
    rangeEnd: rangeEnd ?? new Date(),
    setRangeEnd,
    sleepMetric: currentMetric ?? SleepMetric.QUALITY,
    setSleepMetric: setCurrentMetric,
    activeMetrics: activeMetrics ?? [],
    setActiveMetrics: handleSetStackedMetrics,
    chartView: chartView ?? ChartView.SINGLE_METRIC,
    setChartView
  }), [chartView, currentMetric, handleSetStackedMetrics, rangeEnd, rangeStart, setChartView, setCurrentMetric, setRangeEnd, setRangeStart, activeMetrics])

  return (
    <ChartConfigContext.Provider value={value}>
      {children}
    </ChartConfigContext.Provider>
  )
}
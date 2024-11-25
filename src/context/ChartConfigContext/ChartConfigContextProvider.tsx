import { ChartConfigContext } from './ChartConfigContext'
import { PropsWithChildren, useEffect, useMemo } from 'react'
import { ChartConfigContextBag } from './types'
import { useDefaultQueryParams } from 'hooks/useDefaultQueryParams'
import { SleepMetric } from 'modules/ChartControls'
import { useTranslation } from 'react-i18next'

export const ChartConfigContextProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useTranslation()

  const {
    currentMetric,
    rangeStart,
    rangeEnd,
    language,
    stackedView,
    stackedMetrics,
    setCurrentMetric,
    setRangeEnd,
    setRangeStart,
    setStackedView,
    handleSetStackedMetrics
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
    stackedView: stackedView ?? false,
    setStackedView,
    stackedMetrics: stackedMetrics ?? [],
    setStackedMetrics: handleSetStackedMetrics
  }), [currentMetric, handleSetStackedMetrics, rangeEnd, rangeStart, setCurrentMetric, setRangeEnd, setRangeStart, setStackedView, stackedMetrics, stackedView])

  return (
    <ChartConfigContext.Provider value={value}>
      {children}
    </ChartConfigContext.Provider>
  )
}
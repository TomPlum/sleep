import { ChartConfigContext } from './ChartConfigContext'
import { PropsWithChildren, useMemo } from 'react'
import { ChartConfigContextBag } from './types'
import { useDefaultQueryParams } from 'hooks/useDefaultQueryParams'
import { SleepMetric } from 'modules/ChartControls'
import { useSleepContext } from 'context/SleepContext'

export const ChartConfigContextProvider = ({ children }: PropsWithChildren) => {
  const { sleepData, isSleepDataLoading } = useSleepContext()

  const {
    currentMetric,
    rangeStart,
    rangeEnd,
    stackedView,
    stackedMetrics,
    setCurrentMetric,
    setRangeEnd,
    setRangeStart,
    setStackedView,
    handleSetStackedMetrics
  } = useDefaultQueryParams({
    loading: isSleepDataLoading,
    sleepData
  })

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
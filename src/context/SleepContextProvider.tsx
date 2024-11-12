import { SleepContext } from 'context/SleepContext'
import { PropsWithChildren, useEffect, useMemo } from 'react'
import { SleepContextBag } from 'context/types'
import { useSleepData } from 'data/useSleepData'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { useSleepGraph2DData } from 'modules/graph/hooks/useSleepGraph2DData'
import { useTranslation } from 'react-i18next'
import { useDefaultQueryParams } from 'hooks/useDefaultQueryParams'
import { DataWorkerStatusCode } from 'data/useDataWorker'
import { useRawSleepData } from 'data/useRawSleepData'

export const SleepContextProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useTranslation()
  const { loading } = useSleepData()
  const rawData = useRawSleepData()

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
  } = useDefaultQueryParams({
    loading,
    sleepData: rawData.sleepData
  })

  const sleepGraphData2d = useSleepGraph2DData({
    sessions: rawData.sleepData?.sessions ?? [],
    rangeStart: rangeStart ?? new Date(),
    rangeEnd: rangeEnd ?? new Date(),
    isSleepDataLoading: loading,
    includeNaps: false
  })

  const improvementDate = sleepGraphData2d.data.find(({ date }) => {
    return date.getFullYear() === 2024 && date.getMonth() === 8 && date.getDate() === 6
  })?.date

  useEffect(() => {
    i18n.changeLanguage(language).then(() => {
      console.debug(`Set locale [${language}] from query parameters.`)
    })
  }, [i18n, language])

  const value = useMemo<SleepContextBag>(() => ({
    sleepData: rawData.sleepData,
    sleepStageData: rawData?.sessionStages ?? {},
    isSleepDataLoading: loading || (rawData?.loading ?? true),
    dataWorkerStatus: rawData?.status ?? { percent: 0, statusCode: DataWorkerStatusCode.NOT_STARTED },
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
    stackedMetrics: stackedMetrics ?? [],
    setStackedMetrics: handleSetStackedMetrics
  }), [currentMetric, handleSetStackedMetrics, improvementDate, loading, rangeEnd, rangeStart, rawData?.loading, rawData?.sessionStages, rawData.sleepData, rawData?.status, setCurrentMetric, setRangeEnd, setRangeStart, setStackedView, sleepGraphData2d, stackedMetrics, stackedView])

  return (
    <SleepContext.Provider value={value}>
      {children}
    </SleepContext.Provider>
  )
}
import { SleepContext } from 'context/SleepContext/SleepContext'
import { PropsWithChildren, useEffect, useMemo } from 'react'
import { SleepContextBag } from 'context/SleepContext/types'
import { useSleepGraph2DData } from 'modules/MetricLineChart/hooks/useSleepGraph2DData'
import { useTranslation } from 'react-i18next'
import { useDefaultQueryParams } from 'hooks/useDefaultQueryParams'
import { useRawSleepData } from 'data/useRawSleepData'

export const SleepContextProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useTranslation()
  const { sleepData, sessionStages, sessionSounds, loading } = useRawSleepData()

  const {
    rangeStart,
    rangeEnd,
    language,
    selected
  } = useDefaultQueryParams({
    loading,
    sleepData
  })

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
    i18n.changeLanguage(language).then(() => {
      console.debug(`Set locale [${language}] from query parameters.`)
    })
  }, [i18n, language])

  const value = useMemo<SleepContextBag>(() => ({
    sleepData,
    sleepStageData: sessionStages,
    sleepSoundData: sessionSounds,
    isSleepDataLoading: loading,
    selectedSession: selected,
    graphData2d: sleepGraphData2d ?? { data: [], isSleepDataLoading : true },
    activeSessions: sleepGraphData2d?.data?.length ?? 0,
    improvementDate
  }), [improvementDate, loading, selected, sessionSounds, sessionStages, sleepData, sleepGraphData2d])

  return (
    <SleepContext.Provider value={value}>
      {children}
    </SleepContext.Provider>
  )
}
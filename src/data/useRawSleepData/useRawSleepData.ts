import { usePillowData } from 'data/usePillowData'
import { useEffect, useMemo } from 'react'
import { RawSleepData } from './types'
import { parsePillowData, ParsePillowDataResult } from 'data/useRawSleepData/parsePillowData'
import { useDataWorker } from 'data/useDataWorker'
import { DataWorkerStatus } from 'data/useDataWorker/worker'


export const useRawSleepData = (): RawSleepData => {
  const { data, isLoading, error } = usePillowData({ type: 'raw' })

  const { sessions, stages, sounds } = useMemo<ParsePillowDataResult>(() => {
    if (!data) {
      return {
        sounds: {},
        stages: {},
        sessions: {}
      }
    }

    return parsePillowData({ fileContents: data })
  }, [data])

  const { result, status, running, startProcessing } = useDataWorker()

  useEffect(() => {
    if (Object.keys(sessions).length > 0 && Object.keys(stages).length > 0  && Object.keys(sounds).length > 0) {
      startProcessing({ sessions, stages, sounds })
    }
  }, [sessions, sounds, stages, startProcessing])

  if (!data || isLoading || error) {
    return {
      loading: true,
      sessionStages: {},
      sessionSounds: {},
      status: DataWorkerStatus.ERROR
    }
  }

  return {
    loading: isLoading || running,
    status,
    sessionStages: result?.sleepStages ?? {},
    sessionSounds: result?.sounds ?? {}
  }
}
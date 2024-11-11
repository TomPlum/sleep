import { RawSleepData } from './types'
import { useDataWorker } from 'data/useDataWorker'

export const useRawSleepData = (): RawSleepData => {
  const { result, status, running } = useDataWorker()

  return {
    loading: running,
    status,
    sessionStages: result?.sleepStages ?? {},
    sessionSounds: result?.sounds ?? {}
  }
}
import {
  RawSleepSessionData,
  RawSleepSessionSounds,
  RawSleepSessionStages, RawSleepSoundPointData,
  RawSleepStageData
} from 'data/useRawSleepData/types'

export interface DataWorkerMessageEvent {
  sessions: Record<string, RawSleepSessionData>
  stages: Record<string, RawSleepStageData>
  sounds: Record<string, RawSleepSoundPointData>
}

export interface UseDataWorkerResponse {
  startProcessing: (payload: DataWorkerMessageEvent) => void
  running: boolean
  error?: Error
  result?: DataWorkerResult
}

export interface DataWorkerResponse {
  result: DataWorkerResult
  loading: boolean
  error?: Error
}

export type DataWorkerResult = {
  sleepStages: RawSleepSessionStages,
  sounds: RawSleepSessionSounds
}
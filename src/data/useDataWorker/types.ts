import {
  RawSleepSessionData,
  RawSleepSessionSounds,
  RawSleepSessionStages, RawSleepSoundPointData,
  RawSleepStageData
} from 'data/useRawSleepData/types'
import { DataWorkerStatus } from 'data/useDataWorker/worker'

export interface DataWorkerMessageEvent {
  sessions: Record<string, RawSleepSessionData>
  stages: Record<string, RawSleepStageData>
  sounds: Record<string, RawSleepSoundPointData>
}

export interface UseDataWorkerResponse {
  startProcessing: (payload: DataWorkerMessageEvent) => void
  running: boolean
  error?: Error
  status: DataWorkerStatus
  result?: DataWorkerResult
}

export interface DataWorkerResponse {
  result: DataWorkerResult
  loading: boolean
  error?: Error
  status: DataWorkerStatus
}

export type DataWorkerResult = {
  sleepStages: RawSleepSessionStages,
  sounds: RawSleepSessionSounds
}
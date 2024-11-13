import {
  RawSleepSessionData, RawSleepSessions,
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
  sessions: RawSleepSessions
  sleepStages: RawSleepSessionStages,
  sounds: RawSleepSessionSounds
}

export interface DataWorkerStatus {
  statusCode: DataWorkerStatusCode
  payload?: string
  percent: number
}

export enum DataWorkerStatusCode {
  NOT_STARTED = 'not-started',
  READING_FILE = 'reading-file',
  STARTING = 'starting',
  EXTRACT_SOUND_DATA = 'extract-sound-data',
  EXTRACT_STAGE_DATA = 'extract-stage-data',
  ASSOCIATE_SESSION_DATA = 'associate-session-data',
  FINISHING = 'finishing',
  DONE = 'done',
  ERROR = 'error'
}
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
  result?: DataWorkerResult
}

export interface DataWorkerResponse {
  result?: DataWorkerResult
  loading: boolean
  error?: Error
  status: DataWorkerStatus
}

export type DataWorkerResult = {
  sessions: RawSleepSessions
  sleepStages: RawSleepSessionStages,
  sounds: RawSleepSessionSounds
}

export interface ParsePillowDataProps {
  fileContents: string
}

export interface ParsePillowDataResult {
  sessions: Record<string, RawSleepSessionData>
  sounds: Record<string, RawSleepSoundPointData>
  stages: Record<string, RawSleepStageData>
}



export interface DataWorkerStatus {
  /**
   * The current status code.
   */
  code: DataWorkerStatusCode

  /**
   * Indicates that the worker is
   * currently working and in a
   * loading state.
   */
  loading?: boolean

  /**
   * An optional payload of descriptive
   * information about the current state
   * of the worker.
   */
  payload?: string

  /**
   * Where applicable, a number between
   * 0 and 100 which represents the percentage
   * completion of the current action.
   */
  percent?: number
}

/**
 * Represents a distinct step in the
 * web workers data-processing process.
 */
export enum DataWorkerStatusCode {
  NOT_STARTED = 'not-started',
  STARTING = 'starting',
  READING_FILE = 'reading-file',
  READ_TABLES = 'reading-tables',
  EXTRACT_SOUND_DATA = 'extract-sound-data',
  EXTRACT_STAGE_DATA = 'extract-stage-data',
  ASSOCIATE_SESSION_DATA = 'associate-session-data',
  FINISHING = 'finishing',
  DONE = 'done',
  ERROR = 'error'
}

export const PILLOW_DATABASE_FILE_NAME = 'PillowData-11-11-24.txt'
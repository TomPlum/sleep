import { SleepSessionStage, SleepStage } from 'data/useSleepData'

export interface SleepStageDataProps {
  /**
   * An array of sleep stages that make up
   * a given sleep session.
   */
  stages: SleepSessionStage[]
}

export interface SleepStageDataResponse {
  sleepStageData: SleepSessionStage[]
  stageCounts: Record<SleepStage, number>
  presentStages: [string, number][]
}
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
  stageTransitions: SleepStageTransitionLineData
}

export type SleepStageTransitionLineData = SleepStageTransitionLineDatum[]

export interface SleepStageTransitionLineDatum {
  /**
   * The timestamp, in milliseconds from the epoch,
   * that the transition between the two stage
   * instances happened.
   */
  time: number

  /**
   * The first stage, which is the one on the left
   * hand side of the transition point.
   */
  stage: SleepStage

  /**
   * The second stage, which is the one on the right
   * hand side of the transition point.
   */
  nextStage: SleepStage
}
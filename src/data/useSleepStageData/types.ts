import { SleepSessionStage, SleepStage } from 'data/useSleepData'

export interface SleepStageDataProps {
  /**
   * An array of sleep stages that make up
   * a given sleep session.
   */
  stages: SleepSessionStage[]
}

export interface SleepStageDataResponse {
  /**
   * A collection of metadata for all
   * sleep stage instances in a given session.
   */
  sleepStageData: SleepSessionStage[]

  /**
   * The total number of instances of each
   * sleep stage in a given session.
   */
  stageCounts: Record<SleepStage, number>

  /**
   * A collection of tuples for each of
   * the unique sleep stage types that
   * appear in a given session. Relevant because
   * not all sleep sessions see all four stages.
   */
  presentStages: [string, number][]

  /**
   * A collection of metadata representing the
   * transition points between sleep stage instances
   * in a session. This data is used to draw the
   * vertical lines between stages.
   */
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
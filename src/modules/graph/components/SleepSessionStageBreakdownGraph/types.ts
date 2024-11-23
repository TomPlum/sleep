import { SleepSessionSound, SleepSessionStage, SleepStage } from 'data/useSleepData'

/**
 * Data formatted for consumption by the sleep session
 * stage breakdown graph.
 */
export type SleepStageGraphData = SleepStageGraphDatum[]

export interface SleepStageGraphDatum {
  /**
   * The startTime the instance of the given sleep
   * stage started within the sleep session.
   */
  startTime: number

  /**
   * The endTime the instance of the given sleep
   * stage ended within the sleep session.
   */
  endTime: number

  /**
   * The stage of sleep that this instance
   * represents within the session.
   */
  stage: SleepStage
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

export interface SleepSessionStageBreakdownGraphProps {
  /**
   * An array of sleep stages that make up
   * the selected session.
   */
  stages: SleepSessionStage[]

  /**
   * An array of sounds that were
   * recorded during the selected session.
   */
  sounds: SleepSessionSound[]
}

/**
 * Since the sleep stage breakdown graph has
 * a y-axis with a domain of [0, 4] and the
 * stage instances are represented by rectangular
 * areas, this value provides a consistent offset
 * both above and below the stage midpoint to give
 * the area its height.
 *
 * For example,
 */
export const Y_DOMAIN_OFFSET = 0.3
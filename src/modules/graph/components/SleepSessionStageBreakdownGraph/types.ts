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
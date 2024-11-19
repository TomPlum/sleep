import { SleepSessionSound, SleepSessionStage, SleepStage } from 'data/useSleepData'

/**
 * Data formatted for consumption by the sleep session
 * stage breakdown graph.
 */
export type SleepStageGraphData = SleepStageGraphDatum[]

export interface SleepStageGraphDatum {
  /**
   * The time the instance of the given sleep
   * stage started within the sleep session.
   */
  time: number

  /**
   * The stage of sleep.
   */
  stage: SleepStage

  /**
   * A numerical value representing the stage
   * as used by the charts y-axis.
   */
  y: number
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
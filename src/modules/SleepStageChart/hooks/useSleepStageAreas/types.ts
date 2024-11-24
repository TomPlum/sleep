import { SleepSessionStage } from 'data/useSleepData'

export interface GetSleepStageAreaDataProps {
  /**
   * The sleep stage data to parse and produce
   * area data from.
   */
  sleepStageData: SleepSessionStage[]
}

export interface SleepStageAreaDatum {
  /**
   * The x-ordinate of the point in
   * this area. This is a timestamp
   * which represents a given minute in
   * time that belongs to this sleep stage
   * instance.
   */
  time: number

  /**
   * The y-ordinate of the point in this area.
   * This is calculated based on the instances
   * sleep stage and will be offset either up
   * or down to produce the height of the area.
   */
  y: number

  /**
   * The duration, in milliseconds, that the
   * current sleep stage instance lasted in
   * context of its sleep session.
   */
  duration: number
}

export type SleepStageAreaInstanceData = SleepStageAreaDatum[]

export interface SleepStageAreaInstance {
  /**
   * A unique ID representing this sleep stage
   * area in the given sessions' breakdown.
   */
  id: string

  /**
   * The fill colour of the sleep stage
   * instances area on the graph.
   */
  fill: string

  /**
   * The data points that are used to draw
   * the rectangular area on the graph for
   * the current sleep stage instance.
   */
  data: SleepStageAreaInstanceData
}
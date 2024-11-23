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

export interface SleepSessionStageGraphYAxisMeta {
  /**
   * The domain of the y-axis. This is a range
   * of all the values spanned by the y-axis.
   * Which is [-0.3, 4.3] since the {@link Y_DOMAIN_OFFSET}
   * skews the default [0, 4] range.
   */
  yDomain: number[]

  /**
   * The ticks to render on the y-axis. While these
   * are visually hidden from the axis component
   * itself, they are used by the cartesian grid
   * to render the horizontal grid lines through
   * the centre of the stage instance areas.
   */
  yTicks: number[]
}

/**
 * Since the sleep stage breakdown graph has
 * a y-axis with a domain of [0, 4] and the
 * stage instances are represented by rectangular
 * areas, this value provides a consistent offset
 * both above and below the stage midpoint to give
 * the area its height.
 *
 * For example, light sleep has a value of 1 on
 * the y-axis. So its area would be plotted at
 * 0.7 < y < 1.3 so it has a height of 0.6.
 */
export const Y_DOMAIN_OFFSET = 0.3
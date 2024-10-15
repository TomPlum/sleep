import type {SleepSessionGraph2DData} from "modules/graph/components/SleepSessionsGraph2D";
import {PillowSleepData} from "data/useSleepData";

export interface SleepGraph2DDataProps {
  sleepData?: PillowSleepData
  isSleepDataLoading: boolean
  /**
   * The lower bound within which to
   * filter the sleep sessions to in
   * the rendered graph.
   */
  rangeStart: Date

  /**
   * The upper bound within which to
   * filter the sleep sessions to in
   * the rendered graph.
   */
  rangeEnd: Date
}

export interface SleepGraph2DDataResponse {
  /**
   * The sleep session data structured for
   * rendering a 2D graph.
   */
  data?: SleepSessionGraph2DData

  /**
   * Whether the sleep data is still
   * loading.
   */
  isSleepDataLoading: boolean
}
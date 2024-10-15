import {PillowSleepData} from "data/useSleepData";
import {SleepMetric} from "modules/controls/MetricConfiguration";

export interface SleepContextBag {
  sleepData?: PillowSleepData
  isSleepDataLoading: boolean
  rangeStart: Date
  setRangeStart: (start: Date) => void
  rangeEnd: Date
  setRangeEnd: (start: Date) => void
  sleepMetric: SleepMetric
  setSleepMetric: (metric: SleepMetric) => void
}
import {PillowSleepData} from "data/useSleepData";

export interface SleepContextBag {
  sleepData?: PillowSleepData
  isSleepDataLoading: boolean
}
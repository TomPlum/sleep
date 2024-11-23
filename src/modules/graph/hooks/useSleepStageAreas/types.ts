import { SleepSessionStage } from 'data/useSleepData'

export interface GetSleepStageAreaDataProps {
  sleepStageData: SleepSessionStage[]
}

export interface SleepStageAreaDatum {
  time: number
  y: number
}

export type SleepStageAreaInstanceData = SleepStageAreaDatum[]

export interface SleepStageAreaInstance {
  id: string
  fill: string
  data: SleepStageAreaInstanceData
}
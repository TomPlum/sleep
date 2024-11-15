import { SleepSessionSound, SleepSessionStage } from 'data/useSleepData'

export interface SleepSessionStageBreakdownGraphProps {
  stages: SleepSessionStage[]
  sounds: SleepSessionSound[]
}
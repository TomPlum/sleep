import { SleepSessionStage } from 'data/useSleepData'
import { SleepSessionGraph2DDatum } from 'modules/graph/components/SleepSessionsGraph2D'

export interface SleepSessionInfoProps {
  session: SleepSessionGraph2DDatum
  data: SleepSessionStage[]
}
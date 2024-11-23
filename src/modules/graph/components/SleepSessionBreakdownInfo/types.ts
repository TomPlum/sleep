import { SleepSessionGraph2DDatum } from 'modules/graph/components/SleepSessionsGraph2D'

export interface SleepSessionBreakdownInfoProps {
  session: SleepSessionGraph2DDatum
  onClose: () => void
}
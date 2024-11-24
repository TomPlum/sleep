import { SleepSessionGraph2DDatum } from 'modules/MetricLineChart'

export interface SleepSessionBreakdownInfoProps {
  session: SleepSessionGraph2DDatum
  onClose: () => void
}
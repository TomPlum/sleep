import { SleepSessionGraph2DDatum } from 'modules/MetricLineChart'
import { SleepSessionSound } from 'data/useSleepData'

export interface SleepSessionBreakdownInfoProps {
  session: SleepSessionGraph2DDatum
  sounds: SleepSessionSound[]
  soundsEnabled: boolean
  onToggleSounds: (enabled: boolean) => void
  onClose: () => void
}
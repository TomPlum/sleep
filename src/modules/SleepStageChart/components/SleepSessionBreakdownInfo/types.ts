import { SleepMetricLineChartDatum } from 'modules/MetricLineChart'
import { SleepSessionSound } from 'data/useSleepData'

export interface SleepSessionBreakdownInfoProps {
  session: SleepMetricLineChartDatum
  sounds: SleepSessionSound[]
  soundsEnabled: boolean
  onToggleSounds: (enabled: boolean) => void
  onClose: () => void
}
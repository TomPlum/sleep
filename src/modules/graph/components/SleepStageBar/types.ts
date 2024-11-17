import { Props as XAxisProps } from 'recharts/types/cartesian/XAxis'
import { D3Scale } from 'recharts/types/util/types'
import { SleepStage } from 'data/useSleepData'

export interface SleepStageBarProps {
  chartHeight: number
  uniqueMetrics: number
  cx?: number
  cy?: number
  payload: {
    start: Date
    end: Date
    stage: SleepStage
    y: number
  }
  xAxis: Omit<XAxisProps, 'scale'> & {
    scale: D3Scale<string | number>;
  }
}
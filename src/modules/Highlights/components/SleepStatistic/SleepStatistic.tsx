import { Statistic, StatisticProps } from 'antd'
import CountUp from 'react-countup'
import { SleepStatisticProps } from './types'

const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator="," />
)

export const SleepStatistic = ({ value, suffix, className }: SleepStatisticProps) => {
  return (
    <Statistic
      value={value}
      suffix={suffix}
      className={className}
      formatter={formatter}
    />
  )
}
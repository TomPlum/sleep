import { Line } from 'recharts'
import styles from './SleepMetricLine.module.scss'
import { LineActiveDot } from 'modules/MetricLineChart/components/LineActiveDot'
import { useGraphStyles } from 'modules/MetricLineChart/hooks/useGraphStyles'
import { SleepMetricLineProps } from './types'

export const SleepMetricLine = ({ data, metric, key, onClickActiveDot }: SleepMetricLineProps) => {
  const { currentMetricColour, strokeWidth, activeDotRadius } = useGraphStyles({ metric })

  return (
    <Line
      key={key}
      data={data}
      type='monotone'
      dataKey={metric}
      activeDot={false}
      id={`${metric}_line`}
      className={styles.line}
      animationDuration={500}
      isAnimationActive={true}
      strokeWidth={strokeWidth}
      animationEasing='ease-in-out'
      stroke={currentMetricColour}
      dot={{ fill: undefined, r: activeDotRadius }}
      label={data => (
        <LineActiveDot
          data={data}
          onClick={onClickActiveDot}
          radius={activeDotRadius - 3}
        />
      )}
    />
  )
}
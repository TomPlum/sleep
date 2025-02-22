import styles from './SessionHighlight.module.scss'
import { useSleepContext } from 'context/SleepContext'
import { useMemo } from 'react'
import { SleepMetric } from 'modules/ChartControls'
import { SleepMetricLineChartDatum } from 'modules/MetricLineChart'
import colours from '_colours.module.scss'

const size = 100
const strokeWidth = 8
const innerStrokeWidth = 5

export const SessionHighlight = () => {
  const { graphData2d: { data, earliestSession, latestSession } } = useSleepContext()

  const bestSession = useMemo<SleepMetricLineChartDatum>(() => {
    return data.reduce<SleepMetricLineChartDatum>((bestSessionSoFar, session) => {
      if (session[SleepMetric.QUALITY] > bestSessionSoFar[SleepMetric.QUALITY]) {
        return session
      }

      return bestSessionSoFar
    }, data[0])
  }, [data])

  console.log(bestSession)

  const radius = (size - strokeWidth) / 2
  const innerRadius = ((size - innerStrokeWidth * 2) / 2) - 10
  const circumference = 2 * Math.PI * radius
  const innerCircumference = 2 * Math.PI * innerRadius

  const sleepQualityPercentage = bestSession[SleepMetric.QUALITY]
  const sleepOffset = circumference - (sleepQualityPercentage / 100) * circumference

  const durationPercentage = bestSession[SleepMetric.DURATION]
  const durationPercentageTrimmed = durationPercentage > 100 ? 100 : durationPercentage
  const durationOffset = circumference - (durationPercentageTrimmed / 100) * innerCircumference

  return (
    <div className={styles.container}>
      <div className={styles.chart}>
        <div className={styles.percentage}>
          {sleepQualityPercentage}%
        </div>

        <svg className={styles.percentageCircle} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            className={styles.track}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke='gray'
            strokeWidth={strokeWidth}
            fill="none"
          />

          <circle
            className={styles.progress}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colours.quality}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={sleepOffset}
            strokeLinecap="round"
          />

          <circle
            className={styles.innerTrack}
            cx={size / 2}
            cy={size / 2}
            r={innerRadius}
            stroke='gray'
            strokeWidth={innerStrokeWidth}
            fill="none"
          />

          <circle
            className={styles.innerProgress}
            cx={size / 2}
            cy={size / 2}
            r={innerRadius}
            stroke='white'
            strokeWidth={innerStrokeWidth}
            fill="none"
            strokeDasharray={innerCircumference}
            strokeDashoffset={durationOffset}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}
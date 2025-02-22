import styles from './SessionHighlight.module.scss'
import { useSleepContext } from 'context/SleepContext'
import { useMemo } from 'react'
import { SleepMetric } from 'modules/ChartControls'
import { SleepMetricLineChartDatum } from 'modules/MetricLineChart'
import colours from '_colours.module.scss'

const size = 100
const trackColor = 'blue'
const strokeWidth = 8

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

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = bestSession[SleepMetric.QUALITY]
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={styles.container}>
      <div className={styles.chart}>
        <div className={styles.percentage}>
          {percentage}%
        </div>

        <svg className={styles.percentageCircle} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            className={styles.track}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
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
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}
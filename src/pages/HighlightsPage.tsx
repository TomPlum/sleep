import { DataLoading } from 'data/DataLoading'
import { useSleepContext } from 'context/SleepContext'
import styles from './HighlightsPage.module.scss'
import { NestedProgressCircles } from 'modules/Highlights/components/NestedProgressCircles'
import { useHighlightedSessions } from 'modules/Highlights/hooks/useHighlightedSessions'
import { SleepMetric } from 'modules/ChartControls'
import colours from '_colours.module.scss'
import { SleepStatistic } from 'modules/Highlights/components/SleepStatistic'

// Best Session
// Worst Session
// Most Recent Session
// Trends over last N months

export const HighlightsPage = () => {
  const { isSleepDataLoading } = useSleepContext()
  const { bestSession, worstSession, mostRecentSession } = useHighlightedSessions()
  
  if (isSleepDataLoading) {
    return (
      <DataLoading />
    )
  }

  if (!bestSession || !worstSession || !mostRecentSession) {
    return null
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <NestedProgressCircles
          size={200}
          strokeWidth={25}
          innerColor='white'
          innerStrokeWidth={16}
          outerColor={colours.quality}
          outerPercent={bestSession[SleepMetric.QUALITY]}
          innerPercent={bestSession[SleepMetric.DURATION]}
        />

        <SleepStatistic
          suffix='%'
          value={bestSession[SleepMetric.QUALITY]}
        />
      </div>
    </div>
  )
}
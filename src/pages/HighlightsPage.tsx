import { DataLoading } from 'data/DataLoading'
import { useSleepContext } from 'context/SleepContext'
import styles from './HighlightsPage.module.scss'
import { useHighlightedSessions } from 'modules/Highlights/hooks/useHighlightedSessions'
import { Carousel } from 'antd'
import { BestSessionShowcase } from 'modules/Highlights/components/BestSessionShowcase'

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
        <Carousel>
          <BestSessionShowcase />
        </Carousel>
      </div>
    </div>
  )
}
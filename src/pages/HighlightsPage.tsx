import { DataLoading } from 'data/DataLoading'
import { useSleepContext } from 'context/SleepContext'
import styles from './HighlightsPage.module.scss'
import { useHighlightedSessions } from 'modules/Highlights/hooks/useHighlightedSessions'
import { Button, Carousel, Typography } from 'antd'
import { BestSessionShowcase } from 'modules/Highlights/components/BestSessionShowcase'
import { OverviewShowcase } from 'modules/Highlights/components/OverviewShowcase/OverviewShowcase'
import { useState } from 'react'
import { PillowDataFileLink } from 'components/PillowDataFileLink'
import { useTranslation } from 'react-i18next'

// Overview, total session, time slept, percentage of time slept compared to days etc
// Best Session
// Worst Session
// Most Recent Session
// Trends over last N months

export const HighlightsPage = () => {
  const { isSleepDataLoading } = useSleepContext()
  const { t } = useTranslation('translation', { keyPrefix: 'highlights.landing' })
  const { bestSession, worstSession, mostRecentSession } = useHighlightedSessions()

  const [started, setStarted] = useState(false)
  
  if (isSleepDataLoading) {
    return (
      <DataLoading />
    )
  }

  if (!bestSession || !worstSession || !mostRecentSession) {
    return (
      <div>
        Failed to load session data
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Typography className={styles.heading}>
          {t('heading')}
        </Typography>

        <Typography className={styles.subheading}>
          {t('sub-heading')}
          <PillowDataFileLink className={styles.dataSourceLink} />
        </Typography>

        <Button
          type='primary'
          color='green'
          variant='filled'
          onClick={() => setStarted(true)}
        >
          {t('start-button')}
        </Button>

        {started && (
          <Carousel>
            <OverviewShowcase />
            <BestSessionShowcase />
          </Carousel>
        )}
      </div>
    </div>
  )
}
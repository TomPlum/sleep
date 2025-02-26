import { useSleepContext } from 'context/SleepContext'
import styles from './HighlightsPage.module.scss'
import { Button, Carousel, Typography } from 'antd'
import { BestSessionShowcase } from 'modules/Highlights/components/BestSessionShowcase'
import { OverviewShowcase } from 'modules/Highlights/components/OverviewShowcase/OverviewShowcase'
import { useState } from 'react'
import { PillowDataFileLink } from 'components/PillowDataFileLink'
import { useTranslation } from 'react-i18next'
import { SleepingAnimation } from 'modules/Highlights/components/SleepingAnimation'
import { NightSkyScene } from 'modules/Highlights/components/NightSkyScene'
import { CompactDataLoading } from 'data/CompactDataLoading'

// Overview, total session, time slept, percentage of time slept compared to days etc
// Best Session
// Worst Session
// Most Recent Session
// Trends over last N months
export const HighlightsPage = () => {
  const { isSleepDataLoading } = useSleepContext()
  const { t } = useTranslation('translation', { keyPrefix: 'highlights.landing' })

  const [started, setStarted] = useState(false)

  return (
    <div className={styles.page}>
      <NightSkyScene loading={isSleepDataLoading} />

      <div className={styles.content}>
        <div className={styles.header}>
          <Typography className={styles.heading}>
            {t('heading')}
          </Typography>

          <div className={styles.headerBottom}>
            <Typography className={styles.subheading}>
              {t('sub-heading')}

              <PillowDataFileLink
                className={styles.dataSourceLink}
              />
            </Typography>

            <SleepingAnimation
              className={styles.sleepingAnimation}
            />
          </div>
        </div>

        {isSleepDataLoading && (
          <CompactDataLoading />
        )}

        {!isSleepDataLoading && (
          <Button
            color='green'
            type='primary'
            variant='filled'
            className={styles.startButton}
            onClick={() => setStarted(true)}
          >
            {t('start-button')}
          </Button>
        )}

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
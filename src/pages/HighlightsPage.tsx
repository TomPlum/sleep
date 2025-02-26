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
import { SleepingAnimation } from 'modules/Highlights/components/SleepingAnimation'
import classNames from 'classnames'

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
      <div className={styles.scene}>
        <div className={classNames(styles.star, styles.s1)}></div>
        <div className={classNames(styles.star, styles.s2)}></div>
        <div className={classNames(styles.star, styles.s3)}></div>
        <div className={classNames(styles.star, styles.s4)}></div>
        <div className={classNames(styles.star, styles.s5)}></div>
        <div className={classNames(styles.star, styles.s6)}></div>
        <div className={classNames(styles.star, styles.s7)}></div>
        <div className={styles.moon1}></div>
        <div className={styles.moon}></div>
        <div className={styles.shooting}></div>
        <div className={styles.mountains1}>
          <div className={styles.m1}></div>
          <div className={styles.m2}></div>
          <div className={styles.m3}></div>
          <div className={styles.m4}></div>
        </div>
        <div className={styles.land}>
          <div className={styles.windmill}>
            <div className={styles.light}></div>
            <div className={styles.door}></div>
            <div className={styles.top}></div>
            <div className={styles.blades}>
              <div className={classNames(styles.bl, styles.bl1)}></div>
              <div className={classNames(styles.bl, styles.bl2)}></div>
              <div className={classNames(styles.bl, styles.bl3)}></div>
              <div className={classNames(styles.bl, styles.bl4)}></div>
            </div>
          </div>
          <div className={styles.tree}></div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <Typography className={styles.heading}>
            {t('heading')}
          </Typography>

          <div className={styles.headerBottom}>
            <Typography className={styles.subheading}>
              {t('sub-heading')}
              <PillowDataFileLink className={styles.dataSourceLink} />
            </Typography>

            <SleepingAnimation className={styles.sleepingAnimation} />
          </div>
        </div>

        <Button
          type='primary'
          color='green'
          variant='filled'
          className={styles.startButton}
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
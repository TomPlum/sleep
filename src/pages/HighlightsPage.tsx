import { useSleepContext } from 'context/SleepContext'
import styles from './HighlightsPage.module.scss'
import { Carousel, Typography } from 'antd'
import { BestSessionShowcase } from 'modules/Highlights/components/BestSessionShowcase'
import { OverviewShowcase } from 'modules/Highlights/components/OverviewShowcase/OverviewShowcase'
import { useState } from 'react'
import { PillowDataFileLink } from 'components/PillowDataFileLink'
import { useTranslation } from 'react-i18next'
import { SleepingAnimation } from 'modules/Highlights/components/SleepingAnimation'
import { NightSkyScene } from 'modules/Highlights/components/NightSkyScene'
import { CompactDataLoading } from 'data/CompactDataLoading'
import classNames from 'classnames'
import { StartButton } from 'modules/Highlights/components/StartButton'

// Overview, total session, time slept, percentage of time slept compared to days etc
// Best Session
// Worst Session
// Most Recent Session
// Trends over last N months
export const HighlightsPage = () => {
  const { isSleepDataLoading } = useSleepContext()
  const { t } = useTranslation('translation', { keyPrefix: 'highlights.landing' })

  const [started, setStarted] = useState(false)
  const [starting, setStarting] = useState(false)

  const start = () => {
    setStarting(true)
    setTimeout(() => {
      setStarting(false)
      setStarted(true)
    }, 1000)
  }

  return (
    <div className={styles.page}>
      <NightSkyScene
        loaded={started}
        exiting={starting}
        loading={isSleepDataLoading}
      />

      <div className={styles.content}>
        {!started && (
          <div className={classNames(styles.header, { [styles.headerExiting]: starting })}>
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
        )}

        {isSleepDataLoading && (
          <CompactDataLoading />
        )}

        {!isSleepDataLoading && !started && !starting && (
          <StartButton
            onClick={start}
            text={t('start-button')}
            className={styles.startButton}
          />
        )}

        {started && (
          <div className={styles.showcases}>
            <Carousel dotPosition='right'>
              <OverviewShowcase />
              <BestSessionShowcase />
            </Carousel>
          </div>
        )}
      </div>
    </div>
  )
}
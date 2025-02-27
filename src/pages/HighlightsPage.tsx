import { useSleepContext } from 'context/SleepContext'
import styles from './HighlightsPage.module.scss'
import { Carousel } from 'antd'
import { BestSessionShowcase } from 'modules/Highlights/components/BestSessionShowcase'
import { OverviewShowcase } from 'modules/Highlights/components/OverviewShowcase/OverviewShowcase'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NightSkyScene } from 'modules/Highlights/components/NightSkyScene'
import { CompactDataLoading } from 'data/CompactDataLoading'
import classNames from 'classnames'
import { StartButton } from 'modules/Highlights/components/StartButton'
import { LandingPageHeading } from 'modules/Highlights/components/LandingPageHeading'

// Overview, total session, time slept, percentage of time slept compared to days etc
// Best Session
// Worst Session
// Most Recent Session
// Trends over last N months
// Transition into day-time gradient for average wake-up time, with sun?
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
          <LandingPageHeading
            className={classNames({ [styles.headerExiting]: starting })}
          />
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
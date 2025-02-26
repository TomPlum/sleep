import { DataLoading } from 'data/DataLoading'
import { useSleepContext } from 'context/SleepContext'
import styles from './HighlightsPage.module.scss'
import { useHighlightedSessions } from 'modules/Highlights/hooks/useHighlightedSessions'
import { Button, Carousel, Typography } from 'antd'
import { BestSessionShowcase } from 'modules/Highlights/components/BestSessionShowcase'
import { OverviewShowcase } from 'modules/Highlights/components/OverviewShowcase/OverviewShowcase'
import { CSSProperties, useMemo, useState } from 'react'
import { PillowDataFileLink } from 'components/PillowDataFileLink'
import { useTranslation } from 'react-i18next'
import { SleepingAnimation } from 'modules/Highlights/components/SleepingAnimation'
import classNames from 'classnames'
import { useWindowSize } from '@uidotdev/usehooks'

// Overview, total session, time slept, percentage of time slept compared to days etc
// Best Session
// Worst Session
// Most Recent Session
// Trends over last N months

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const HighlightsPage = () => {
  const { width } = useWindowSize()
  const { isSleepDataLoading } = useSleepContext()
  const { t } = useTranslation('translation', { keyPrefix: 'highlights.landing' })
  const { bestSession, worstSession, mostRecentSession } = useHighlightedSessions()

  const [started, setStarted] = useState(false)

  const path = useMemo(() => {
    const step = width === null || width < 1000 ? 4 : 2
    const quantity = width == null ? 75 : width > 1000 ? 100 : 50

    const values = Array(quantity).fill('').map((_v, i) => {
      const depth = getRandomInt(60, 150)
      return `${(i + 1) * step}% ${depth}px`
    })

    values.unshift('0% 0%') // <-- Top left [2]
    values.unshift('0% 100%') // <-- Bottom left [1]
    // Values from above are in the middle here
    values.push('100% 0%') // <-- Top Right [3]
    values.push('100% 100%') // <-- Bottom Right [4]

    return {
      '--path': values.join(',')
    }
  }, [width]) as CSSProperties
  console.log(path)
  
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

        <div className={styles.mountains} style={path} />

        <div className={styles.land} />
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
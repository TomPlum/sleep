import styles from './SessionHighlightCard.module.scss'
import { useSleepContext } from 'context/SleepContext'
import { useMemo } from 'react'
import { SleepMetric } from 'modules/ChartControls'
import { SleepMetricLineChartDatum } from 'modules/MetricLineChart'
import colours from '_colours.module.scss'
import { useTranslation } from 'react-i18next'
import { formatDuration } from 'utils/formatDuration'
import { Carousel } from 'antd'
import { NestedProgressCircles } from 'modules/Highlights/components/NestedProgressCircles'
import classNames from 'classnames'

const size = 100
const strokeWidth = 10

export const SessionHighlightCard = () => {
  const { graphData2d: { data, latestSession } } = useSleepContext()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.session-highlight' })

  const bestSession = useMemo<SleepMetricLineChartDatum>(() => {
    return data.reduce<SleepMetricLineChartDatum>((bestSessionSoFar, session) => {
      if (session[SleepMetric.QUALITY] > bestSessionSoFar[SleepMetric.QUALITY]) {
        return session
      }

      return bestSessionSoFar
    }, data[0])
  }, [data])

  const worstSession = useMemo<SleepMetricLineChartDatum>(() => {
    return data.reduce<SleepMetricLineChartDatum>((worstSessionSoFar, session) => {
      if (session[SleepMetric.QUALITY] < worstSessionSoFar[SleepMetric.QUALITY]) {
        return session
      }

      return worstSessionSoFar
    }, data[0])
  }, [data])

  const mostRecentSession = useMemo<SleepMetricLineChartDatum | undefined>(() => {
    return data.find(session => session.date.getTime() === latestSession.getTime())
  }, [data, latestSession])

  return (
    <div className={styles.container}>
      <Carousel className={styles.carousel} dotPosition='right'>
        <div className={styles.carouselItem}>
          <NestedProgressCircles
            size={size}
            innerColor='white'
            strokeWidth={strokeWidth}
            outerColor={colours.quality}
            outerPercent={bestSession[SleepMetric.QUALITY]}
            innerPercent={bestSession[SleepMetric.DURATION]}
          />

          <div className={styles.content}>
            <p className={styles.title}>
              {t('best.title')}
            </p>

            <p className={classNames(styles.percentage, styles.good)}>
              {bestSession[SleepMetric.QUALITY]}%
            </p>

            <p className={styles.duration}>
              {formatDuration(bestSession.duration)}
            </p>
          </div>
        </div>

        <div className={styles.carouselItem}>
          <NestedProgressCircles
            size={size}
            innerColor='white'
            strokeWidth={strokeWidth}
            outerColor={colours.quality}
            outerPercent={worstSession[SleepMetric.QUALITY]}
            innerPercent={worstSession[SleepMetric.DURATION]}
          />

          <div className={styles.content}>
            <p className={styles.title}>
              {t('worst.title')}
            </p>

            <p className={classNames(styles.percentage, styles.bad)}>
              {worstSession[SleepMetric.QUALITY]}%
            </p>

            <p className={styles.duration}>
              {formatDuration(worstSession.duration)}
            </p>
          </div>
        </div>

        {mostRecentSession && (
          <div className={styles.carouselItem}>
            <NestedProgressCircles
              size={size}
              innerColor='white'
              strokeWidth={strokeWidth}
              outerColor={colours.quality}
              outerPercent={mostRecentSession[SleepMetric.QUALITY]}
              innerPercent={mostRecentSession[SleepMetric.DURATION]}
            />

            <div className={styles.content}>
              <p className={styles.title}>
                {t('recent.title')}
              </p>

              <p className={classNames(styles.percentage, styles.good)}>
                {mostRecentSession[SleepMetric.QUALITY]}%
              </p>

              <p className={styles.duration}>
                {formatDuration(mostRecentSession.duration)}
              </p>
            </div>
          </div>
        )}
      </Carousel>
    </div>
  )
}
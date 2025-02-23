import styles from './SessionHighlightCard.module.scss'
import { useSleepContext } from 'context/SleepContext'
import { useMemo } from 'react'
import { SleepMetric } from 'modules/ChartControls'
import { SleepMetricLineChartDatum } from 'modules/MetricLineChart'
import { Carousel, ConfigProvider, theme } from 'antd'
import { HighlightCarouselItem } from 'modules/Highlights/components/HighlightCarouselItem'
import { SessionHighlightCardProps } from './types'
import { CloseOutlined } from '@ant-design/icons'

export const SessionHighlightCard = ({ onClose }: SessionHighlightCardProps) => {
  const { graphData2d: { data, latestSession } } = useSleepContext()

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
      <div className={styles.content}>
        <CloseOutlined
          onClick={onClose}
          className={styles.close}
        />

        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            components: {
              Carousel: {
                dotGap: 10,
                dotOffset: 6
              }
            }
          }}
        >
          <Carousel
            dotPosition='right'
            autoplaySpeed={3000}
            className={styles.carousel}
            autoplay={{ dotDuration: true }}
            dots={{ className: styles.dots }}
          >
            <HighlightCarouselItem
              translationKey='best'
              session={bestSession}
            />

            <HighlightCarouselItem
              translationKey='worst'
              session={worstSession}
            />

            {mostRecentSession && (
              <HighlightCarouselItem
                translationKey='recent'
                session={mostRecentSession}
              />
            )}
          </Carousel>
        </ConfigProvider>
      </div>
    </div>
  )
}
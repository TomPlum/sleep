import styles from './SessionHighlightCard.module.scss'
import { Carousel, ConfigProvider, theme } from 'antd'
import { HighlightCarouselItem } from 'modules/Highlights/components/HighlightCarouselItem'
import { SessionHighlightCardProps } from './types'
import { CloseOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { useHighlightedSessions } from 'modules/Highlights/hooks/useHighlightedSessions'

export const SessionHighlightCard = ({ className, onClose }: SessionHighlightCardProps) => {
  const { bestSession, worstSession, mostRecentSession } = useHighlightedSessions()

  return (
    <div className={classNames(styles.container, className)}>
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
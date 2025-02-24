import styles from './HighlightCarouselItem.module.scss'
import { NestedProgressCircles } from 'modules/Highlights/components/NestedProgressCircles'
import colours from '_colours.module.scss'
import classNames from 'classnames'
import { formatDuration } from 'utils/formatDuration'
import { HighlightCarouselItemProps } from './types'
import { useTranslation } from 'react-i18next'

export const HighlightCarouselItem = ({ session, translationKey }: HighlightCarouselItemProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.session-highlight' })

  const sleepQualityPercentage = session.sleepQuality
  const isQualityGood = sleepQualityPercentage > 75

  return (
    <div className={styles.carouselItem}>
      <NestedProgressCircles
        size={100}
        strokeWidth={10}
        innerColor='white'
        innerStrokeWidth={8}
        outerColor={colours.quality}
        className={styles.progressCircles}
        outerPercent={sleepQualityPercentage}
        innerPercent={session.duration.total}
      />

      <div className={styles.content}>
        <p className={styles.title}>
          {t(`${translationKey}.title`)}
        </p>

        <p className={classNames(styles.percentage, isQualityGood ? styles.good : styles.bad)}>
          {sleepQualityPercentage}%
        </p>

        <p className={styles.duration}>
          {formatDuration(session.duration.total)}
        </p>
      </div>
    </div>
  )
}
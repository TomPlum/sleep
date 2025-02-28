import { NestedProgressCircles } from 'modules/Highlights/components/NestedProgressCircles'
import colours from 'styles/_colours.module.scss'
import { SleepStatistic } from 'modules/Highlights/components/SleepStatistic'
import { useHighlightedSessions } from 'modules/Highlights/hooks/useHighlightedSessions'
import styles from './BestSessionShowcase.module.scss'
import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'
import dayjs from 'dayjs'
import { formatDuration } from 'utils/formatDuration.ts'

export const BestSessionShowcase = () => {
  const { bestSession } = useHighlightedSessions()
  const { t } = useTranslation('translation', { keyPrefix: 'highlights.showcases.best' })

  return (
    <div className={styles.showcase}>
      <NestedProgressCircles
        size={200}
        strokeWidth={25}
        innerColor='white'
        innerStrokeWidth={16}
        outerColor={colours.quality}
        outerPercent={bestSession.sleepQuality}
        innerPercent={bestSession.duration.total}
      />

      <div className={styles.content}>
        <Typography className={styles.heading}>
          {t('heading', { date: dayjs(bestSession.startTime).format('dddd Do YYYY') })}
        </Typography>

        <Typography className={styles.duration}>
          {t('duration', { duration: formatDuration(bestSession.duration.total) })}
        </Typography>

        <Typography className={styles.quality}>
          {t('quality', { quality: bestSession.sleepQuality })}
        </Typography>

        <SleepStatistic
          suffix='%'
          className={styles.sleepQuality}
          value={bestSession.sleepQuality}
        />
      </div>
    </div>
  )
}
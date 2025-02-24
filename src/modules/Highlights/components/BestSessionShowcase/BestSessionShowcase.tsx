import { NestedProgressCircles } from 'modules/Highlights/components/NestedProgressCircles'
import colours from '_colours.module.scss'
import { SleepStatistic } from 'modules/Highlights/components/SleepStatistic'
import { useHighlightedSessions } from 'modules/Highlights/hooks/useHighlightedSessions'
import styles from './BestSessionShowcase.module.scss'
import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'
import dayjs from 'dayjs'
import { formatDuration } from 'utils/formatDuration'

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

      <Typography>
        {t('heading', { date: dayjs(bestSession.startTime).format('dddd Do YYYY') })}
      </Typography>

      <Typography>
        {t('duration', { duration: formatDuration(bestSession.duration.total) })}
      </Typography>

      <Typography>
        {t('quality', { quality: bestSession.sleepQuality })}
      </Typography>

      <SleepStatistic
        suffix='%'
        value={bestSession.sleepQuality}
      />
    </div>
  )
}
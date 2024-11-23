import { TooltipProps } from 'recharts'
import styles from './SleepStageTooltip.module.scss'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { getSleepMetricDisplayName } from 'modules/graph/utils/getSleepMetricDisplayName'
import { SleepStageAreaDatum } from 'modules/graph/hooks/useSleepStageAreas'
import { getSleepStageFromYValue } from 'modules/graph/utils/getSleepStageYValue'
import { getMetricColour } from 'modules/graph/hooks/useGraphStyles'

export const SleepStageTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.sleep-stage-breakdown.tooltip' })

  const data = payload?.[0]?.payload as SleepStageAreaDatum

  if (active && data) {
    const sleepMetric = getSleepStageFromYValue(data.y)

    return (
      <div className={styles.tooltip}>
        <div className={styles.section}>
          <Typography className={styles.label}>
            {t('stage')}
          </Typography>

          {data.y && (
            <Typography className={styles.value} style={{ color: getMetricColour(sleepMetric) }}>
              {getSleepMetricDisplayName(sleepMetric)}
            </Typography>
          )}
        </div>

        <div className={styles.section}>
          <Typography className={styles.label}>
            {t('duration')}
          </Typography>

          {data.time && (
            <Typography className={styles.value}>
              {dayjs(data.time).format('HH:mm')}
            </Typography>
          )}
        </div>
      </div>
    )
  }
}
import { TooltipProps } from 'recharts'
import styles from './SleepStageTooltip.module.scss'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { getSleepMetricDisplayName } from 'utils/getSleepMetricDisplayName'
import { SleepStageAreaDatum } from 'modules/SleepStageChart/hooks/useSleepStageAreas'
import { getSleepStageFromYValue } from 'modules/SleepStageChart/utils/getSleepStageYValue'
import { getMetricColour } from 'modules/MetricLineChart/hooks/useGraphStyles'
import { formatTimeElapsed } from 'data/utils/formatTimeElapsed'

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

          {data.duration && (
            <Typography className={styles.value}>
              {formatTimeElapsed({ time: data.duration, showMs: false })}
            </Typography>
          )}
        </div>

        <div className={styles.section}>
          <Typography className={styles.label}>
            {t('timestamp')}
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
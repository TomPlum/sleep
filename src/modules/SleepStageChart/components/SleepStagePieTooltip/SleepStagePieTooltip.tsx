import { useTranslation } from 'react-i18next'
import styles from './SleepStagePieTooltip.module.scss'
import { Typography } from 'antd'
import { getMetricColour } from 'modules/MetricLineChart/hooks/useGraphStyles'
import { getSleepMetricDisplayName } from 'utils/getSleepMetricDisplayName'
import { formatTimeElapsed } from 'data/utils/formatTimeElapsed'
import { TooltipProps } from 'recharts'
import { SleepStagePieDatum } from 'modules/SleepStageChart/components/SleepStagePieChart'

export const SleepStagePieTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.sleep-stage-breakdown.tooltip' })

  const data = payload?.[0]?.payload as SleepStagePieDatum
  console.log(data)

  if (active && data) {
    return (
      <div className={styles.tooltip}>
        <div className={styles.section}>
          <Typography className={styles.label}>
            {t('stage')}
          </Typography>

          {data.metric && (
            <Typography className={styles.value} style={{ color: getMetricColour(data.metric) }}>
              {getSleepMetricDisplayName(data.metric)}
            </Typography>
          )}
        </div>

        <div className={styles.section}>
          <Typography className={styles.label}>
            {t('duration')}
          </Typography>

          {data.duration && (
            <Typography className={styles.value}>
              {formatTimeElapsed({
                time: data.duration * 60 * 1000,
                showMs: false,
                showSeconds: false
              })}
            </Typography>
          )}
        </div>
      </div>
    )
  }
}
import { TooltipProps } from 'recharts'
import styles from './SleepStageTooltip.module.scss'
import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { SleepStageGraphDatum } from 'modules/graph/components/SleepSessionStageBreakdownGraph/types'
import dayjs from 'dayjs'
import { getSleepMetricDisplayName } from 'modules/graph/utils/getSleepMetricDisplayName'

export const SleepStageTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.sleep-stage-breakdown.tooltip' })

  const data = payload?.[0]?.payload as SleepStageGraphDatum

  if (active && data) {
    return (
      <div className={styles.tooltip}>
        <Typography className={styles.label}>
          {t('stage')}
        </Typography>

        {data.stage && (
          <Typography className={styles.value}>
            {getSleepMetricDisplayName(data.stage)}
          </Typography>
        )}

        <Typography className={styles.label}>
          {t('duration')}
        </Typography>

        {data.startTime && data.endTime && (
          <Typography className={styles.value}>
            {dayjs(data.startTime).format('HH:mm')} - {dayjs(data.endTime).format('HH:mm')}
          </Typography>
        )}
      </div>
    )
  }
}
import { TooltipProps } from 'recharts'
import styles from './SleepSessionTooltip.module.scss'
import { Typography } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { DurationBreakdownPie } from 'modules/graph/components/DurationBreakdownPie'
import { SleepSessionGraph2DDatum } from 'modules/graph/components/SleepSessionsGraph2D'

export const SleepSessionTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.tooltip' })

  const data = payload?.[0]?.payload as SleepSessionGraph2DDatum

  if (active && data) {
    return (
      <div className={styles.tooltip}>
        {data.isNap && (
          <div className={styles.nap}>
            {t('nap')}
          </div>
        )}

        <Typography className={styles.label}>
          {t('date')}
        </Typography>

        {data.date && (
          <Typography className={styles.value}>
            {dayjs(data.date.toString()).format('Do MMM YYYY - HH:mm')}
          </Typography>
        )}

        <Typography className={styles.label}>
          {t('duration')}
        </Typography>

        <Typography className={styles.value}>
          {Math.floor(data.duration / 60)}h {Math.round(data.duration % 60)}m
        </Typography>

        <Typography className={styles.label}>
          {t('quality')}
        </Typography>

        <Typography className={styles.value}>
          {data.quality}%
        </Typography>

        <DurationBreakdownPie
          data={{
            rem: data.rem_sleep,
            deep: data.deep_sleep,
            awake: data.awake_time,
            light: data.light_sleep
          }}
        />
      </div>
    )
  }
}
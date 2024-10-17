import { TooltipProps } from "recharts"
import styles from './SleepSessionTooltip.module.scss'
import { Typography } from "antd"
import dayjs from "dayjs"
import { useTranslation } from "react-i18next"
import { DurationBreakdownPie } from "modules/graph/components/DurationBreakdownPie"

export const SleepSessionTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.tooltip' })

  const data = payload?.[0]?.payload

  if (active && data) {
    return (
      <div className={styles.tooltip}>
        <Typography className={styles.label}>
          {t('date')}
        </Typography>

        {data.date && (
          <Typography className={styles.value}>
            {dayjs(data.date.toString()).format('DD-MM-YYYY HH:mm:ss')}
          </Typography>
        )}

        <Typography className={styles.label}>
          {t('duration')}
        </Typography>

        <Typography className={styles.value}>
          {Math.floor(data.duration / 60)}h {data.duration % 60}m
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
import {TooltipProps} from "recharts";
import styles from './SleepSessionTooltip.module.scss'
import {Typography} from "antd";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";

export const SleepSessionTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.tooltip' })

  const data = payload?.[0]?.payload

  if (active && data) {
    return (
      <div className={styles.tooltip}>
        <Typography className={styles.label}>
          {t('date')}
        </Typography>

        <Typography className={styles.value}>
          {dayjs(data.date.toString()).format('DD-MM-YYYY HH:mm:ss')}
        </Typography>

        <Typography className={styles.label}>
          {t('quality')}
        </Typography>

        <Typography className={styles.value}>
          {data.quality}%
        </Typography>

        <Typography className={styles.label}>
          {t('rem')}
        </Typography>

        <Typography className={styles.value}>
          {Number(data.rem_sleep).toFixed(0)}%
        </Typography>

        <Typography className={styles.label}>
          {t('deep')}
        </Typography>

        <Typography className={styles.value}>
          {Number(data.deep_sleep).toFixed(0)}%
        </Typography>

        <Typography className={styles.label}>
          {t('light')}
        </Typography>

        <Typography className={styles.value}>
          {Number(data.light_sleep).toFixed(0)}%
        </Typography>

        <Typography className={styles.label}>
          {t('awake')}
        </Typography>

        <Typography className={styles.value}>
          {Number(data.awake_time).toFixed(0)}%
        </Typography>
      </div>
    )
  }
}
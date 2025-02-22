import { TooltipProps } from 'recharts'
import styles from './SleepSessionTooltip.module.scss'
import { Typography } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { SleepMetricLineChartDatum } from 'modules/MetricLineChart'
import { useCallback } from 'react'
import { SleepMood } from 'data/useSleepData'
import { FrownOutlined, MehOutlined, QuestionCircleOutlined, SmileOutlined } from '@ant-design/icons'
import { formatDuration } from 'utils/formatDuration'

export const SleepSessionTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.tooltip' })

  const data = payload?.[0]?.payload as SleepMetricLineChartDatum

  const getMoodIcon = useCallback(() => {
    if (data) {
      switch (data.mood) {
        case SleepMood.GOOD: {
          return <SmileOutlined className={styles.good} />
        }
        case SleepMood.OK: {
          return <MehOutlined className={styles.ok} />
        }
        case SleepMood.BAD: {
          return <FrownOutlined className={styles.bad} />
        }
        case SleepMood.UNKNOWN: {
          return <QuestionCircleOutlined className={styles.unknown} />
        }
      }
    }

    return null
  }, [data])

  if (active && data) {
    return (
      <div className={styles.tooltip}>
        {data.isNap && (
          <div className={styles.nap}>
            {t('nap')}
          </div>
        )}

        <div className={styles.mood}>
          {getMoodIcon()}
        </div>

        <Typography className={styles.label}>
          {t('date')}
        </Typography>

        {data.date && (
          <Typography className={styles.value}>
            {dayjs(data.date.toString()).format('ddd Do MMM YYYY - HH:mm')}
          </Typography>
        )}

        <Typography className={styles.label}>
          {t('duration')}
        </Typography>

        <Typography className={styles.value}>
          {formatDuration(data.duration)}
        </Typography>

        <Typography className={styles.label}>
          {t('quality')}
        </Typography>

        <Typography className={styles.value}>
          {data.quality}%
        </Typography>
      </div>
    )
  }
}
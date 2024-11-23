import styles from './SleepSessionBreakdownInfo.module.scss'
import { DurationBreakdownPie, DurationBreakdownPieData } from 'modules/graph/components/DurationBreakdownPie'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { useTranslation } from 'react-i18next'
import { SleepSessionBreakdownInfoProps } from 'modules/graph/components/SleepSessionBreakdownInfo/types'

export const SleepSessionBreakdownInfo = ({ session }: SleepSessionBreakdownInfoProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.sleep-session-info' })

  const pieData = useMemo<DurationBreakdownPieData | undefined>(() => {
    if (!session) {
      return undefined
    }

    return ({
      awake: session[SleepMetric.AWAKE_TIME],
      deep: session[SleepMetric.DEEP_SLEEP],
      light: session[SleepMetric.LIGHT_SLEEP],
      rem: session[SleepMetric.REM_SLEEP]
    })
  }, [session])
  
  const startTime = dayjs(session.date)
  const endTime = dayjs(session.endTime).add(1, 'hour') // TODO: Check this +1 hour. Its offset GMT+1
  const hoursDifference = endTime.diff(startTime, 'hours')
  const remainingMinutes = endTime.diff(startTime, 'minutes') % hoursDifference

  return (
    <div className={styles.info}>
      <p className={styles.text}>
        {startTime.format('ddd Do MMM YYYY')}
      </p>

      <p className={styles.text}>
        {startTime.format('HH:mm')}
        {' -> '}
        {endTime.format('HH:mm')}
        {' '}
        ({hoursDifference}{t('hour')} {remainingMinutes}{t('minute')})
      </p>

      {pieData && (
        <div className={styles.pieContainer}>
          <DurationBreakdownPie data={pieData}/>
        </div>
      )}
    </div>
  )
}
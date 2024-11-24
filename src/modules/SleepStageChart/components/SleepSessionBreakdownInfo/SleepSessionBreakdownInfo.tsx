import styles from './SleepSessionBreakdownInfo.module.scss'
import { SleepStagePieChart } from 'modules/SleepStageChart/components/SleepStagePieChart'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { SleepSessionBreakdownInfoProps } from 'modules/SleepStageChart/components/SleepSessionBreakdownInfo/types'
import { CloseOutlined } from '@ant-design/icons'

export const SleepSessionBreakdownInfo = ({ session, onClose }: SleepSessionBreakdownInfoProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.sleep-session-info' })
  
  const startTime = dayjs(session.date)
  const endTime = dayjs(session.endTime).add(1, 'hour') // TODO: Check this +1 hour. Its offset GMT+1
  const hoursDifference = endTime.diff(startTime, 'hours')
  const remainingMinutes = endTime.diff(startTime, 'minutes') % hoursDifference

  return (
    <div className={styles.info}>
      <CloseOutlined
        onClick={onClose}
        className={styles.close}
      />

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

      {session && (
        <div className={styles.pieContainer}>
          <SleepStagePieChart sessionData={session} />
        </div>
      )}
    </div>
  )
}
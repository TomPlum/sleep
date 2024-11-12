import { SleepSessionStageBreakdownGraph } from 'modules/graph/components/SleepSessionStageBreakdownGraph'
import { SleepSessionInfoProps } from './types'
import styles from './SleepSessionInfo.module.scss'
import dayjs from 'dayjs'

export const SleepSessionInfo = ({ data, session }: SleepSessionInfoProps) => {
  return (
    <div className={styles.container}>
      <SleepSessionStageBreakdownGraph data={data} />

      <div className={styles.info}>
        {dayjs(session.date).format('ddd Do MMM YYYY - HH:mm')}
      </div>
    </div>
  )
}
import { SleepSessionStageBreakdownGraph } from 'modules/graph/components/SleepSessionStageBreakdownGraph'
import { SleepSessionInfoProps } from './types'
import styles from './SleepSessionInfo.module.scss'
import dayjs from 'dayjs'
import { useSleepContext } from 'context'

export const SleepSessionInfo = ({ session }: SleepSessionInfoProps) => {
  console.log('session', session)
  const { sleepStageData, sleepSoundData } = useSleepContext()

  return (
    <div className={styles.container}>
      <SleepSessionStageBreakdownGraph
        stages={sleepStageData[session.id]}
        sounds={sleepSoundData[session.id]}
      />

      <div className={styles.info}>
        {dayjs(session.date).format('ddd Do MMM YYYY - HH:mm')}
      </div>
    </div>
  )
}
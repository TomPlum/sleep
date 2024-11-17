import { SleepSessionStageBreakdownGraph } from 'modules/graph/components/SleepSessionStageBreakdownGraph'
import { SleepSessionInfoProps } from './types'
import styles from './SleepSessionInfo.module.scss'
import dayjs from 'dayjs'
import { useSleepContext } from 'context'
import { DurationBreakdownPie, DurationBreakdownPieData } from 'modules/graph/components/DurationBreakdownPie'
import { useMemo } from 'react'
import { SleepMetric } from 'modules/controls/MetricConfiguration'

export const SleepSessionInfo = ({ session }: SleepSessionInfoProps) => {
  const { sleepStageData, sleepSoundData } = useSleepContext()

  const pieData = useMemo<DurationBreakdownPieData>(() => ({
    awake: session[SleepMetric.AWAKE_TIME],
    deep: session[SleepMetric.DEEP_SLEEP],
    light: session[SleepMetric.LIGHT_SLEEP],
    rem: session[SleepMetric.REM_SLEEP]
  }), [session])

  return (
    <div className={styles.container}>
      <SleepSessionStageBreakdownGraph
        stages={sleepStageData[session.id]}
        sounds={sleepSoundData[session.id]}
      />

      <div className={styles.info}>
        {dayjs(session.date).format('ddd Do MMM YYYY - HH:mm')}

        <div className={styles.pieContainer}>
          <DurationBreakdownPie data={pieData} />
        </div>
      </div>
    </div>
  )
}
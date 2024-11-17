import { SleepSessionStageBreakdownGraph } from 'modules/graph/components/SleepSessionStageBreakdownGraph'
import styles from './SleepSessionInfo.module.scss'
import dayjs from 'dayjs'
import { useSleepContext } from 'context'
import { DurationBreakdownPie, DurationBreakdownPieData } from 'modules/graph/components/DurationBreakdownPie'
import { useEffect, useMemo, useState } from 'react'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { useQueryParams } from 'hooks/useQueryParams'
import { SleepSessionGraph2DDatum } from 'modules/graph/components/SleepSessionsGraph2D'
import { useTranslation } from 'react-i18next'

export const SleepSessionInfo = () => {
  const { queryParams } = useQueryParams()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.sleep-session-info' })
  const { graphData2d, sleepStageData, sleepSoundData, selectedSession: id } = useSleepContext()

  const [selectedSession, setSelectedSession] = useState<SleepSessionGraph2DDatum>()

  useEffect(() => {
    if (queryParams.selected) {
      const session = graphData2d.data[queryParams.selected]
      setSelectedSession(session)
    }

    if (id) {
      setSelectedSession(graphData2d.data[id])
    }
  }, [id, graphData2d.data, queryParams.selected])

  const pieData = useMemo<DurationBreakdownPieData | undefined>(() => {
    if (!selectedSession) {
      return undefined
    }

    return ({
      awake: selectedSession[SleepMetric.AWAKE_TIME],
      deep: selectedSession[SleepMetric.DEEP_SLEEP],
      light: selectedSession[SleepMetric.LIGHT_SLEEP],
      rem: selectedSession[SleepMetric.REM_SLEEP]
    })
  }, [selectedSession])

  if (!selectedSession || !sleepStageData || !sleepSoundData) {
    return null
  }

  const startTime = dayjs(selectedSession.date)
  const endTime = dayjs(selectedSession.endTime)
  const hoursDifference = endTime.diff(startTime, 'hours')
  const remainingMinutes = endTime.diff(startTime, 'minutes') % hoursDifference

  return (
    <div className={styles.container}>
      <SleepSessionStageBreakdownGraph
        stages={sleepStageData[selectedSession.id]}
        sounds={sleepSoundData[selectedSession.id]}
      />

      <div className={styles.info}>
        <p className={styles.text}>
          {startTime.format('ddd Do MMM YYYY')}
        </p>

        <p className={styles.text}>
          {startTime.format('HH:mm')}
          {' '}
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
    </div>
  )
}
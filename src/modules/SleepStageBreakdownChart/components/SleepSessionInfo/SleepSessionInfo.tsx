import { SleepSessionStageBreakdownGraph } from 'modules/SleepStageBreakdownChart'
import styles from './SleepSessionInfo.module.scss'
import { useSleepContext } from 'context'
import { useCallback, useEffect, useState } from 'react'
import { useQueryParams } from 'hooks/useQueryParams'
import { SleepSessionGraph2DDatum } from 'modules/MetricLineChart'
import { SleepSessionBreakdownInfo } from 'modules/SleepStageBreakdownChart/components/SleepSessionBreakdownInfo'

export const SleepSessionInfo = () => {
  const { queryParams } = useQueryParams()
  const { graphData2d, sleepStageData, sleepSoundData, selectedSession: id } = useSleepContext()

  const [selectedSession, setSelectedSession] = useState<SleepSessionGraph2DDatum>()

  const handleClose = useCallback(() => {
    setSelectedSession(undefined)
  }, [])

  useEffect(() => {
    if (queryParams.selected) {
      const session = graphData2d.data[queryParams.selected]
      setSelectedSession(session)
    }

    if (id) {
      setSelectedSession(graphData2d.data[id])
    }
  }, [id, graphData2d.data, queryParams.selected])

  if (!selectedSession || !sleepStageData || !sleepSoundData) {
    return null
  }

  return (
    <div className={styles.container}>
      <SleepSessionStageBreakdownGraph
        stages={sleepStageData[selectedSession.id]}
        sounds={sleepSoundData[selectedSession.id]}
      />

     <SleepSessionBreakdownInfo
       onClose={handleClose}
       session={selectedSession}
     />
    </div>
  )
}
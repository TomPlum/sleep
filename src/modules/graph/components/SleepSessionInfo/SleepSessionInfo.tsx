import { SleepSessionStageBreakdownGraph } from 'modules/graph/components/SleepSessionStageBreakdownGraph'
import styles from './SleepSessionInfo.module.scss'
import { useSleepContext } from 'context'
import { useEffect, useState } from 'react'
import { useQueryParams } from 'hooks/useQueryParams'
import { SleepSessionGraph2DDatum } from 'modules/graph/components/SleepSessionsGraph2D'
import { SleepSessionBreakdownInfo } from 'modules/graph/components/SleepSessionBreakdownInfo'

export const SleepSessionInfo = () => {
  const { queryParams } = useQueryParams()
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

  if (!selectedSession || !sleepStageData || !sleepSoundData) {
    return null
  }

  return (
    <div className={styles.container}>
      <SleepSessionStageBreakdownGraph
        stages={sleepStageData[selectedSession.id]}
        sounds={sleepSoundData[selectedSession.id]}
      />

     <SleepSessionBreakdownInfo session={selectedSession} />
    </div>
  )
}
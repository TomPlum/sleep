import styles from './SleepPage.module.scss'
import {
  SleepSessionGraph2DDatum,
  SleepSessionsGraph2D
} from 'modules/graph/components/SleepSessionsGraph2D'
import { useSleepContext } from 'context'
import { GraphControls } from 'modules/controls/GraphControls'
import { ActiveSessionInfo } from 'modules/graph/components/ActiveSessionInfo'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { useCallback, useEffect, useState } from 'react'
import { StackedGraphPlaceholder } from 'modules/graph/components/StackedGraphPlaceholder'
import { DataLoading } from 'data/DataLoading'
import { SleepSessionInfo } from 'modules/graph/components/SleepSessionInfo'

export const SleepPage = () => {
  const [selectedSession, setSelectedSession] = useState<SleepSessionGraph2DDatum>()

  const {
    graphData2d,
    stackedView,
    sleepMetric,
    stackedMetrics,
    sleepStageData,
    isSleepDataLoading
  } = useSleepContext()

  useEffect(() => {
    const existingFavicon = document.querySelector('link[rel=\'icon\']') as HTMLLinkElement
    const newFaviconUrl = `${import.meta.env.BASE_URL}favicon-${sleepMetric.split('_')[0]}.svg`

    if (existingFavicon) {
      existingFavicon.href = newFaviconUrl
    } else {
      const newFavicon = document.createElement('link')
      newFavicon.rel = 'icon'
      newFavicon.href = newFaviconUrl
      document.head.appendChild(newFavicon)
    }
  }, [sleepMetric])

  const handleSelectSession = useCallback((index: number) => {
    const session = graphData2d.data[index]
    console.log('Selected session', session)
    setSelectedSession(session)
  }, [graphData2d.data])

  if (isSleepDataLoading) {
    return (
      <DataLoading />
    )
  }

  return (
    <div className={styles.container}>
      <ActiveSessionInfo className={styles.sessionInfo} />

      <GraphControls className={styles.controls} />

      {stackedView && (
        <div className={styles.graphContainer}>
          {stackedMetrics.map((metric: SleepMetric) => (
            <SleepSessionsGraph2D
              metric={metric}
              className={styles.graph}
              key={`sleep-graph-2d-${metric}`}
              selectedSession={selectedSession?.id}
              onSelectSession={handleSelectSession}
            />
          ))}

          {stackedMetrics.length < 2 && (
            [...Array(2 - stackedMetrics.length).keys()].map(i => (
              <StackedGraphPlaceholder
                id={i}
                key={`graph-placeholder-${i}`}
              />
            ))
          )}
        </div>
      )}

      <div className={styles.graphContainer}>
        {!stackedView && (
          <SleepSessionsGraph2D
            metric={sleepMetric}
            className={styles.graph}
            selectedSession={selectedSession?.id}
            onSelectSession={handleSelectSession}
          />
        )}

        {sleepStageData && selectedSession && (
          <SleepSessionInfo
            session={selectedSession}
            data={sleepStageData[selectedSession?.id]}
          />
        )}
      </div>
    </div>
  )
}
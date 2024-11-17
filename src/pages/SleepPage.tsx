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
import { useDynamicFavicon } from 'hooks/useDynamicFavicon'
import { useQueryParams } from 'hooks/useQueryParams'
import { PageRoutes } from 'routes'

export const SleepPage = () => {
  const {
    graphData2d,
    stackedView,
    sleepMetric,
    stackedMetrics,
    sleepStageData,
    isSleepDataLoading
  } = useSleepContext()

  const { queryParams, updateQueryParam } = useQueryParams()

  const [selectedSession, setSelectedSession] = useState<SleepSessionGraph2DDatum>()

  useEffect(() => {
    if (queryParams.selected) {
      const session = graphData2d.data[queryParams.selected]
      setSelectedSession(session)
    }
  }, [graphData2d.data, queryParams.selected])

  useDynamicFavicon()

  const handleSelectSession = useCallback((index: number) => {
    updateQueryParam({
      route: PageRoutes.SLEEP,
      params: {
        selected: index.toString()
      }
    })

    const session = graphData2d.data[index]
    setSelectedSession(session)
  }, [updateQueryParam, graphData2d.data])

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

          {sleepStageData && selectedSession && (
            <SleepSessionInfo
              session={selectedSession}
            />
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

        {sleepStageData && (selectedSession) && (
          <SleepSessionInfo session={selectedSession} />
        )}
      </div>
    </div>
  )
}
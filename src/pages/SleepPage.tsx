import styles from './SleepPage.module.scss'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { SleepSessionsGraph2D } from 'modules/graph/components/SleepSessionsGraph2D'
import { useSleepContext } from 'context'
import { GraphControls } from 'modules/controls/GraphControls'
import { ActiveSessionInfo } from 'modules/graph/components/ActiveSessionInfo'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { useEffect } from 'react'
import { StackedGraphPlaceholder } from 'modules/graph/components/StackedGraphPlaceholder'

export const SleepPage = () => {
  const { isSleepDataLoading, stackedMetrics, stackedView, sleepMetric } = useSleepContext()

  useEffect(() => {
    const existingFavicon = document.querySelector('link[rel=\'icon\']') as HTMLLinkElement
    const newFaviconUrl = `/favicon-${sleepMetric.split('_')[0]}.svg`

    if (existingFavicon) {
      existingFavicon.href = newFaviconUrl
    } else {
      const newFavicon = document.createElement('link')
      newFavicon.rel = 'icon'
      newFavicon.href = newFaviconUrl
      document.head.appendChild(newFavicon)
    }
  }, [sleepMetric])

  if (isSleepDataLoading) {
    return (
      <div className={styles.loading}>
        <Spin
          size="large"
          indicator={<LoadingOutlined spin />}
        />
      </div>
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

      {!stackedView && (
        <SleepSessionsGraph2D
          metric={sleepMetric}
          className={styles.graph}
        />
      )}
    </div>
  )
}
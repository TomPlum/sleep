import styles from './SleepPage.module.scss'
import {
  SleepSessionsGraph2D
} from 'modules/MetricLineChart'
import { useSleepContext } from 'context'
import { GraphControls } from 'modules/ChartControls'
import { ActiveSessionInfo } from 'components/ActiveSessionInfo'
import { SleepMetric } from 'modules/ChartControls'
import { StackedGraphPlaceholder } from 'components/StackedGraphPlaceholder'
import { DataLoading } from 'data/DataLoading'
import { SleepSessionInfo } from 'modules/SleepStageBreakdownChart/components/SleepSessionInfo'
import { useDynamicFavicon } from 'hooks/useDynamicFavicon'

export const SleepPage = () => {
  const {
    stackedView,
    sleepMetric,
    stackedMetrics,
    isSleepDataLoading
  } = useSleepContext()

  useDynamicFavicon()

  if (isSleepDataLoading) {
    return (
      <DataLoading />
    )
  }

  return (
    <div className={styles.container}>
      <ActiveSessionInfo className={styles.sessionInfo} />

      <GraphControls className={styles.controls} />

      <div className={styles.content}>
        {stackedView && (
          <>
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
          </>
        )}

        {!stackedView && (
          <SleepSessionsGraph2D
            metric={sleepMetric}
            className={styles.graph}
          />
        )}

        <SleepSessionInfo />
      </div>
    </div>
  )
}
import styles from './SleepPage.module.scss'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { SleepSessionsGraph2D } from 'modules/graph/components/SleepSessionsGraph2D'
import { useSleepContext } from 'context'
import { GraphControls } from 'modules/controls/GraphControls'
import { ActiveSessionInfo } from 'modules/graph/components/ActiveSessionInfo'
import { SleepMetric } from 'modules/controls/MetricConfiguration'

export const SleepPage = () => {
  const { isSleepDataLoading, stackedMetrics, stackedView, sleepMetric } = useSleepContext()
  console.log(stackedMetrics)

  if (isSleepDataLoading) {
    return (
      <Spin
        size="large"
        indicator={<LoadingOutlined spin />}
      />
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
        </div>
      )}

      {!stackedView && (
        <SleepSessionsGraph2D
          metric={sleepMetric}
        />
      )}
    </div>
  )
}
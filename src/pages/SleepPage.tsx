import styles from './SleepPage.module.scss'
import { SleepMetricLineChart } from 'modules/MetricLineChart'
import { useSleepContext } from 'context/SleepContext'
import { SleepMetric } from 'modules/ChartControls'
import { ChartMetricSelection } from 'components/ChartMetricSelection'
import { DataLoading } from 'data/DataLoading'
import { SleepSessionInfo } from 'modules/SleepStageChart/components/SleepSessionInfo'
import { useDynamicFavicon } from 'hooks/useDynamicFavicon'
import { useChartConfigContext } from 'context/ChartConfigContext'
import { ChartView } from 'modules/ChartControls/components/ChartViewSelector/types'
import { SleepSessionsGraph3D } from 'modules/SleepSessionsChart3D'
import { SleepPageChrome } from 'components/SleepPageChrome'
import { ThreeConfigContextProvider } from 'context/ThreeConfigContext'

export const SleepPage = () => {
  const { isSleepDataLoading } = useSleepContext()
  const { chartView, sleepMetric, activeMetrics, is3DActive } = useChartConfigContext()

  useDynamicFavicon()

  if (isSleepDataLoading) {
    return (
      <DataLoading />
    )
  }

  if (is3DActive) {
    return (
      <SleepPageChrome>
        <ThreeConfigContextProvider>
          <SleepSessionsGraph3D />
        </ThreeConfigContextProvider>
      </SleepPageChrome>
    )
  }

  return (
    <SleepPageChrome>
      {chartView == ChartView.SINGLE_METRIC && (
        <>
          <SleepMetricLineChart
            metric={sleepMetric}
            className={styles.graph}
          />

          {!sleepMetric && (
            <ChartMetricSelection
              id='single-metric-view-metric-selection'
            />
          )}
        </>
      )}

      {chartView == ChartView.STACKED_METRICS && (
        <>
          {activeMetrics.map((metric: SleepMetric) => (
            <SleepMetricLineChart
              metric={metric}
              className={styles.graph}
              key={`sleep-graph-2d-${metric}`}
            />
          ))}

          {activeMetrics.length < 2 && (
            [...Array(2 - activeMetrics.length).keys()].map(i => (
              <ChartMetricSelection
                id={i}
                key={`graph-placeholder-${i}`}
              />
            ))
          )}
        </>
      )}

      {chartView === ChartView.MULTIPLE_METRICS && (
        <>
          {activeMetrics.length === 2 && (
            <SleepMetricLineChart
              metric={sleepMetric}
              className={styles.graph}
            />
          )}

          {activeMetrics.length < 2 && (
            <ChartMetricSelection
              allowDualSelection
              id='multiple-metrics-view-metric-selection'
            />
          )}
        </>
      )}

      <SleepSessionInfo />
    </SleepPageChrome>
  )
}
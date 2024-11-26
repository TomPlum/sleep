import styles from './MetricCheckbox.module.scss'
import { useCallback } from 'react'
import { useQueryParams } from 'hooks/useQueryParams'
import { MetricCheckboxProps } from 'modules/ChartControls/components/MetricCheckbox/types'
import { getMetricColour } from 'modules/MetricLineChart/hooks/useGraphStyles'
import { PageRoutes } from 'routes'
import { SleepMetric } from 'modules/ChartControls'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { useChartConfigContext } from 'context/ChartConfigContext'
import { ChartView } from 'modules/ChartControls/components/ChartViewSelector/types'

export const MetricCheckbox = ({ metric, className }: MetricCheckboxProps) => {
  const { updateQueryParam } = useQueryParams()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph-controls.metric-config.checkbox' })
  const { sleepMetric, setSleepMetric, chartView, activeMetrics, setActiveMetrics } = useChartConfigContext()

  const stackedView = chartView === ChartView.STACKED_METRICS
  const multipleMetrics = chartView === ChartView.MULTIPLE_METRICS
  const checked = (stackedView || multipleMetrics) ? activeMetrics.includes(metric) : sleepMetric === metric

  const handleCheckboxChange = useCallback(() => {
    const isBoxNowChecked = !checked

    if (isBoxNowChecked) {
      if (stackedView || multipleMetrics) {
        if (activeMetrics.length < 2) {
          setActiveMetrics((existing: SleepMetric[]) => {
            const newMetrics = [
              ...existing,
              metric
            ]

            updateQueryParam({
              route: PageRoutes.SLEEP,
              params: {
                metrics: newMetrics.join(',')
              }
            })

            return newMetrics
          })
        }
      } else {
        setSleepMetric(metric)

        updateQueryParam({
          route: PageRoutes.SLEEP,
          params: {
            metric
          }
        })
      }
    } else {
      if (stackedView || multipleMetrics) {
        const newMetrics = activeMetrics.filter(it => it !== metric)

        setActiveMetrics(newMetrics)

        updateQueryParam({
          route: PageRoutes.SLEEP,
          params: {
            metrics: newMetrics.join(',')
          }
        })
      }
    }
  }, [checked, metric, multipleMetrics, setSleepMetric, setActiveMetrics, activeMetrics, stackedView, updateQueryParam])

  return (
    <label className={styles.label}>
      <input
        type='checkbox'
        checked={checked}
        name={t(metric.split('_')[0])}
        onChange={handleCheckboxChange}
        className={classNames(styles.checkbox, className)}
        style={{ accentColor: getMetricColour(metric) }}
      />
      {t(metric.split('_')[0])}
    </label>
  )
}
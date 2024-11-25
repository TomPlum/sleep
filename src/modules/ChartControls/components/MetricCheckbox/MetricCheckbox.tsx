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

export const MetricCheckbox = ({ metric, className }: MetricCheckboxProps) => {
  const { updateQueryParam } = useQueryParams()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph-controls.metric-config.checkbox' })
  const { sleepMetric, setSleepMetric, stackedView, stackedMetrics, setStackedMetrics } = useChartConfigContext()

  const checked = stackedView ? stackedMetrics.includes(metric) : sleepMetric === metric

  const handleCheckboxChange = useCallback(() => {
    const newChecked = !checked

    if (newChecked) {
      if (stackedView) {
        if (stackedMetrics.length < 2) {
          setStackedMetrics((existing: SleepMetric[]) => {
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
      if (stackedView) {
        const newMetrics = stackedMetrics.filter(it => it !== metric)

        setStackedMetrics(newMetrics)

        updateQueryParam({
          route: PageRoutes.SLEEP,
          params: {
            metrics: newMetrics.join(',')
          }
        })
      }
    }
  }, [checked, metric, setSleepMetric, setStackedMetrics, stackedMetrics, stackedView, updateQueryParam])

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
import { Checkbox } from 'antd'
import styles from './MetricCheckbox.module.scss'
import { CSSProperties, useCallback } from 'react'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { useQueryParams } from 'hooks/useQueryParams'
import { MetricCheckboxProps } from 'modules/controls/MetricCheckbox/types'
import { useGraphStyles } from 'modules/graph/hooks/useGraphStyles'
import { useSleepContext } from 'context'
import { PageRoutes } from 'routes'
import { SleepMetric } from 'modules/controls/MetricConfiguration'

export const MetricCheckbox = ({ label, metric }: MetricCheckboxProps) => {
  const { updateQueryParam } = useQueryParams()
  const { getMetricColour } = useGraphStyles({ metric })
  const { sleepMetric, setSleepMetric, stackedView, stackedMetrics, setStackedMetrics } = useSleepContext()

  const handleChange = useCallback((e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      if (stackedView) {
        setStackedMetrics((existing: SleepMetric[]) => [
          ...existing,
          metric
        ])
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
      }
    }
  }, [metric, setSleepMetric, setStackedMetrics, stackedMetrics, stackedView, updateQueryParam])

  const checked = stackedView ? stackedMetrics.includes(metric) : sleepMetric === metric

  return (
    <Checkbox
      onChange={handleChange}
      className={styles.checkbox}
      style={{
        '--background-color': getMetricColour(metric),
        '--border-color': getMetricColour(metric)
      } as CSSProperties}
      checked={checked}
    >
      {label}
    </Checkbox>
  )
}
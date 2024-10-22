import { Checkbox } from 'antd'
import styles from './MetricCheckbox.module.scss'
import { CSSProperties, useCallback } from 'react'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { useQueryParams } from 'hooks/useQueryParams'
import { MetricCheckboxProps } from 'modules/controls/MetricCheckbox/types'
import { getMetricColour } from 'modules/graph/hooks/useGraphStyles'
import { useSleepContext } from 'context'
import { PageRoutes } from 'routes'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

export const MetricCheckbox = ({ metric, className }: MetricCheckboxProps) => {
  const { updateQueryParam } = useQueryParams()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph-controls.metric-config.checkbox' })
  const { sleepMetric, setSleepMetric, stackedView, stackedMetrics, setStackedMetrics } = useSleepContext()

  const handleCheckboxChange = useCallback((e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      if (stackedView) {
        if (stackedMetrics.length < 2) {
          setStackedMetrics((existing: SleepMetric[]) => [
            ...existing,
            metric
          ])
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
      }
    }
  }, [metric, setSleepMetric, setStackedMetrics, stackedMetrics, stackedView, updateQueryParam])

  const checked = stackedView ? stackedMetrics.includes(metric) : sleepMetric === metric

  return (
    <Checkbox
      checked={checked}
      onChange={handleCheckboxChange}
      className={classNames(styles.checkbox, className)}
      style={{
        '--background-color': getMetricColour(metric),
        '--border-color': getMetricColour(metric)
      } as CSSProperties}
    >
      {t(metric.split('_')[0])}
    </Checkbox>
  )
}
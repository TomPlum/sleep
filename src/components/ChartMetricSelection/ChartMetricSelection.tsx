import styles from './ChartMetricSelection.module.scss'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ChartMetricSelectionProps } from 'components/ChartMetricSelection/types'
import { useCallback, useMemo, useState } from 'react'
import { SleepMetric } from 'modules/ChartControls'
import { MetricButton } from 'modules/ChartControls'
import classNames from 'classnames'
import { useGraphHeight } from 'modules/MetricLineChart/hooks/useGraphHeight'
import { useChartConfigContext } from 'context/ChartConfigContext'
import { useQueryParams } from 'hooks/useQueryParams'
import { PageRoutes } from 'routes'

export const ChartMetricSelection = ({ id, allowDualSelection }: ChartMetricSelectionProps) => {
  const { updateQueryParam } = useQueryParams()
  const { setStackedMetrics } = useChartConfigContext()

  const { height } = useGraphHeight()
  const { stackedMetrics } = useChartConfigContext()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.placeholder' })

  const [selected, setSelected] = useState<SleepMetric | undefined>(stackedMetrics.length === 1 ? stackedMetrics[0] : undefined)
  const [previewMetric, setPreviewMetric] = useState<SleepMetric>()

  const handleMouseOver = useCallback((metric: SleepMetric) => {
    setPreviewMetric(metric)
  }, [])

  const handleMouseOut = useCallback(() => {
    setPreviewMetric(undefined)
  }, [])

  const availableMetrics = useMemo<SleepMetric[]>(() => {
    const allMetrics = Object.values(SleepMetric)

    if (allowDualSelection) {
      return allMetrics
    }

    return allMetrics.filter(metric => !stackedMetrics.includes(metric))
  }, [allowDualSelection, stackedMetrics])

  const handleSelect = useCallback((metric: SleepMetric) => {
    if (selected === metric) {
      setSelected(undefined)
    } else if (selected) {
      setStackedMetrics(() => {
        const newMetrics = [selected, metric]

        updateQueryParam({
          route: PageRoutes.SLEEP,
          params: {
            metrics: newMetrics.join(',')
          }
        })

        return newMetrics
      })
    } else {
      setSelected(metric)
    }
  }, [selected, setStackedMetrics, updateQueryParam])

  const messageKey = useMemo<'first' | 'second'>(() => {
    if (allowDualSelection) {
      return !selected ? 'first' : 'second'
    }

    if (stackedMetrics.length === 0) {
      return id === 0 ? 'first' : 'second'
    }

    return 'second'
  }, [allowDualSelection, id, selected, stackedMetrics.length])

  return (
    <div className={styles.placeholder} style={{ height }}>
      <InfoCircleOutlined className={styles.infoIcon} />

      <p className={styles.selectText}>
        {t(`message.${messageKey}`)}
      </p>

      <div className={styles.metrics}>
        {availableMetrics.map(metric => (
          <MetricButton
            metric={metric}
            onMouseOut={handleMouseOut}
            key={`placeholder-metric-button-${metric}`}
            onMouseOver={() => handleMouseOver(metric)}
            onClick={allowDualSelection ? handleSelect : undefined}
            className={classNames(
              styles.button,
              styles[metric],
              { [styles[`${metric}--selected`]]: metric === selected }
            )}
          />
        ))}
      </div>

      <p className={styles.description} key={previewMetric}>
        {previewMetric ? t(`description.${previewMetric}`) : ''}
      </p>
    </div>
  )
}
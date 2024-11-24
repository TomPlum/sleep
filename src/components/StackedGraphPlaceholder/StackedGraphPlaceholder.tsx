import styles from './StackedGraphPlaceholder.module.scss'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { StackedGraphPlaceholderProps } from 'components/StackedGraphPlaceholder/types'
import { useCallback, useMemo, useState } from 'react'
import { SleepMetric } from 'modules/ChartControls'
import { MetricButton } from 'modules/ChartControls'
import classNames from 'classnames'
import { useGraphHeight } from 'modules/MetricLineChart/hooks/useGraphHeight'
import { useChartConfigContext } from 'context/ChartConfigContext'

export const StackedGraphPlaceholder = ({ id }: StackedGraphPlaceholderProps) => {
  const [previewMetric, setPreviewMetric] = useState<SleepMetric>()

  const { height } = useGraphHeight()
  const { stackedMetrics } = useChartConfigContext()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.placeholder' })

  const handleMouseOver = useCallback((metric: SleepMetric) => {
    setPreviewMetric(metric)
  }, [])

  const handleMouseOut = useCallback(() => {
    setPreviewMetric(undefined)
  }, [])

  const availableMetrics = useMemo<SleepMetric[]>(() => {
    const allMetrics = Object.values(SleepMetric)
    return allMetrics.filter(metric => !stackedMetrics.includes(metric))
  }, [stackedMetrics])

  const messageKey = useMemo<'first' | 'second'>(() => {
    if (stackedMetrics.length === 0) {
      return id === 0 ? 'first' : 'second'
    }

    return 'second'
  }, [id, stackedMetrics.length])

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
            className={classNames(styles.button, styles[metric])}
          />
        ))}
      </div>

      <p className={styles.description} key={previewMetric}>
        {previewMetric ? t(`description.${previewMetric}`) : ''}
      </p>
    </div>
  )
}
import styles from './StackedGraphPlaceholder.module.scss'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { StackedGraphPlaceholderProps } from 'modules/graph/components/StackedGraphPlaceholder/types'
import { useSleepContext } from 'context'
import { useCallback, useMemo } from 'react'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { MetricCheckbox } from 'modules/controls/MetricCheckbox'
import { createStyles } from 'antd-style'
import { useGraphStyles } from 'modules/graph/hooks/useGraphStyles'

const useStyle = () => {
  const { getMetricColour } = useGraphStyles({ metric: SleepMetric.QUALITY })

  const getButtonStyle = useCallback((metric: SleepMetric) => {
    return createStyles(({ prefixCls, css }) => ({
      button: css`
        &.${prefixCls}-btn-dashed:not([disabled]):not(.${prefixCls}-btn-dangerous) {
          transition: all ease-in-out 0.2s;
          width: 100px;
          :hover {
            border-color: ${getMetricColour(metric)};
            color: ${getMetricColour(metric)};
          }
        }
      `,
    }))().styles.button
  }, [getMetricColour])

  return {
    getButtonStyle
  }
}

export const StackedGraphPlaceholder = ({ id }: StackedGraphPlaceholderProps) => {
  const { stackedMetrics } = useSleepContext()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.placeholder' })

  const availableMetrics = useMemo<SleepMetric[]>(() => {
    const allMetrics = Object.values(SleepMetric)
    return allMetrics.filter(metric => !stackedMetrics.includes(metric))
  }, [stackedMetrics])

  const { getButtonStyle } = useStyle()

  return (
    <div className={styles.placeholder}>
      <InfoCircleOutlined className={styles.infoIcon} />

      <p className={styles.selectText}>
        {t(`message.${id === 0 ? 'first' : 'second'}`)}
      </p>

      <div className={styles.metrics}>
        {availableMetrics.map(metric => (
          <MetricCheckbox
            type='button'
            metric={metric}
            className={getButtonStyle(metric)}
            key={`placeholder-metric-checkbox-${metric}`}
          />
        ))}
      </div>
    </div>
  )
}
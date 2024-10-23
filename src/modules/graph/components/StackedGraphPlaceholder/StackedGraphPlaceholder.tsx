import styles from './StackedGraphPlaceholder.module.scss'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { StackedGraphPlaceholderProps } from 'modules/graph/components/StackedGraphPlaceholder/types'
import { useSleepContext } from 'context'
import { useMemo } from 'react'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { MetricButton } from 'modules/controls/MetricButton'
import classNames from 'classnames'

export const StackedGraphPlaceholder = ({ id }: StackedGraphPlaceholderProps) => {
  const { stackedMetrics } = useSleepContext()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.placeholder' })

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
    <div className={styles.placeholder}>
      <InfoCircleOutlined className={styles.infoIcon} />

      <p className={styles.selectText}>
        {t(`message.${messageKey}`)}
      </p>

      <div className={styles.metrics}>
        {availableMetrics.map(metric => (
          <MetricButton
            metric={metric}
            key={`placeholder-metric-button-${metric}`}
            className={classNames(styles.button, styles[metric])}
          />
        ))}
      </div>
    </div>
  )
}
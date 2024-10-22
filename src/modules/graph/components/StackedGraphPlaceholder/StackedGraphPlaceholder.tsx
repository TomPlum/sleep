import styles from './StackedGraphPlaceholder.module.scss'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { StackedGraphPlaceholderProps } from 'modules/graph/components/StackedGraphPlaceholder/types'
import { useSleepContext } from 'context'
import { useMemo } from 'react'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { MetricCheckbox } from 'modules/controls/MetricCheckbox'

export const StackedGraphPlaceholder = ({ id }: StackedGraphPlaceholderProps) => {
  const { stackedMetrics } = useSleepContext()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.placeholder' })

  const availableMetrics = useMemo<SleepMetric[]>(() => {
    const allMetrics = Object.values(SleepMetric)
    return allMetrics.filter(metric => !stackedMetrics.includes(metric))
  }, [stackedMetrics])

  return (
    <div className={styles.placeholder} key={`graph-placeholder-${id}`}>
      <InfoCircleOutlined className={styles.infoIcon} />

      <p className={styles.selectText}>
        {t(`message.${id === 0 ? 'first' : 'second'}`)}
      </p>

      <div>
        {availableMetrics.map(metric => (
          <MetricCheckbox label={metric} metric={metric} />
        ))}
      </div>
    </div>
  )
}
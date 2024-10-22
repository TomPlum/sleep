import { useTranslation } from 'react-i18next'
import { useSleepContext } from 'context'
import { useCallback } from 'react'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { Button } from 'antd'
import { MetricButtonProps } from 'modules/controls/MetricButton/types'

export const MetricButton = ({ metric, className }: MetricButtonProps) => {
  const {  setStackedMetrics } = useSleepContext()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph-controls.metric-config.checkbox' })

  const handleButtonClick = useCallback(() => {
    setStackedMetrics((existing: SleepMetric[]) => [
      ...existing,
      metric
    ])
  }, [metric, setStackedMetrics])

  return (
    <Button
      size='large'
      type='dashed'
      className={className}
      onClick={handleButtonClick}
    >
      {t(metric.split('_')[0])}
    </Button>
  )
}
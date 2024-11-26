import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { SleepMetric } from 'modules/ChartControls'
import { Button } from 'antd'
import { MetricButtonProps } from 'modules/ChartControls/components/MetricButton/types'
import { PageRoutes } from 'routes'
import { useQueryParams } from 'hooks/useQueryParams'
import { useChartConfigContext } from 'context/ChartConfigContext'

export const MetricButton = ({ metric, onMouseOver, onMouseOut, className, onClick }: MetricButtonProps) => {
  const { updateQueryParam } = useQueryParams()
  const { setStackedMetrics } = useChartConfigContext()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph-controls.metric-config.checkbox' })

  const handleButtonClick = useCallback(() => {
    if (onClick) {
      onClick(metric)
    } else {
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
  }, [metric, onClick, setStackedMetrics, updateQueryParam])

  return (
    <Button
      size='large'
      type='dashed'
      className={className}
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
      onClick={handleButtonClick}
    >
      {t(metric.split('_')[0])}
    </Button>
  )
}
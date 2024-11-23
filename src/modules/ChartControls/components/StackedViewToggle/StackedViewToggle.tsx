import { Switch } from 'antd'
import { useSleepContext } from 'context'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryParams } from 'hooks/useQueryParams'
import { PageRoutes } from 'routes'

export const StackedViewToggle = () => {
  const { updateQueryParam, removeQueryParam } = useQueryParams()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph-controls.stacked' })
  const { stackedView, setStackedView, stackedMetrics, setStackedMetrics } = useSleepContext()

  const handleToggle = useCallback((checked: boolean) => {
    const newStackedValue = !stackedView
    setStackedView(newStackedValue)

    if (checked) {
      setStackedMetrics([])
      removeQueryParam({
        route: PageRoutes.SLEEP,
        key: 'metrics'
      })
    }

    updateQueryParam({
      route: PageRoutes.SLEEP,
      params: {
        stacked: String(newStackedValue)
      }
    })
  }, [removeQueryParam, setStackedMetrics, setStackedView, stackedView, updateQueryParam])

  return (
    <Switch
      size='default'
      checked={stackedView}
      onChange={handleToggle}
      checkedChildren={t('inactive')}
      unCheckedChildren={t('active')}
      loading={stackedView && stackedMetrics.length < 2}
    />
  )
}
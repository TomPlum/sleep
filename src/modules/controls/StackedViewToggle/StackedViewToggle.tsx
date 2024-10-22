import { Switch } from 'antd'
import { useSleepContext } from 'context'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryParams } from 'hooks/useQueryParams'
import { PageRoutes } from 'routes'

export const StackedViewToggle = () => {
  const { updateQueryParam } = useQueryParams()
  const { stackedView, setStackedView, stackedMetrics } = useSleepContext()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph-controls.stacked' })

  const handleToggle = useCallback(() => {
    const newStackedValue = !stackedView

    setStackedView(newStackedValue)

    updateQueryParam({
      route: PageRoutes.SLEEP,
      params: {
        stacked: String(newStackedValue)
      }
    })
  }, [setStackedView, stackedView, updateQueryParam])

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
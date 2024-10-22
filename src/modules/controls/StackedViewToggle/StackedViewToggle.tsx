import { Switch } from 'antd'
import { useSleepContext } from 'context'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export const StackedViewToggle = () => {
  const { stackedView, setStackedView, stackedMetrics } = useSleepContext()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph-controls.stacked' })

  const handleToggle = useCallback(() => {
    setStackedView(!stackedView)
  }, [setStackedView, stackedView])

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
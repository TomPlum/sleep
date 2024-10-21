import { Switch } from 'antd'
import { useSleepContext } from 'context'
import { useCallback } from 'react'

export const StackedViewToggle = () => {
  const { stackedView, setStackedView } = useSleepContext()

  const handleToggle = useCallback(() => {
    setStackedView(!stackedView)
  }, [setStackedView, stackedView])

  return (
    <Switch
      size='small'
      checked={stackedView}
      onChange={handleToggle}
    />
  )
}
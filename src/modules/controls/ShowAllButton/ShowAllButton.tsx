import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSleepContext } from 'context'
import { useDateSelection } from 'modules/graph/hooks/useDateSelection'
import { useCallback } from 'react'

export const ShowAllButton = () => {
  const { sleepData } = useSleepContext()
  const { setDateRange } = useDateSelection()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph-controls' })

  const handleClick = useCallback(() => {
    if (sleepData) {
      setDateRange(sleepData.earliestSession, sleepData.latestSession)
    }
  }, [setDateRange, sleepData])

  return (
    <Button onClick={handleClick} size='small' color='default'>
      {t('show-all')}
    </Button>
  )
}
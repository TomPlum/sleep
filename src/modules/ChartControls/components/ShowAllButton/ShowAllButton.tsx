import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSleepContext } from 'context/SleepContext'
import { useDateSelection } from 'modules/ChartControls/hooks/useDateSelection'
import { useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import { useChartConfigContext } from 'context/ChartConfigContext'

export const ShowAllButton = () => {
  const { setDateRange } = useDateSelection()
  const { sleepData, graphData2d } = useSleepContext()
  const { rangeStart, rangeEnd } = useChartConfigContext()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph-controls.show-all' })

  const isShowingAll = useMemo<boolean>(() => {
    if (graphData2d && sleepData) {
      const earliestRecordedSession = sleepData.earliestSession
      const latestRecordedSession = sleepData.latestSession
      const isShowingLowerBound = rangeStart.getTime() === earliestRecordedSession.getTime()
      const isShowingUpperBound = rangeEnd.getTime() === latestRecordedSession.getTime()
      return isShowingLowerBound && isShowingUpperBound
    }

    return false
  }, [graphData2d, rangeEnd, rangeStart, sleepData])

  const handleClick = useCallback(() => {
    if (graphData2d && sleepData) {
      if (isShowingAll) {
        setDateRange(dayjs(graphData2d.latestSession).subtract(2, 'month').toDate(), graphData2d.latestSession)
      } else {
        setDateRange(sleepData.earliestSession, sleepData.latestSession)
      }
    }
  }, [graphData2d, sleepData, isShowingAll, setDateRange])

  return (
    <Button onClick={handleClick} size='small' color='default'>
      {isShowingAll ? t('default') : t('all')}
    </Button>
  )
}
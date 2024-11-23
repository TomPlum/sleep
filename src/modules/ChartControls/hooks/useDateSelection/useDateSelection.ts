import { DateSelectionResponse } from 'modules/ChartControls/hooks/useDateSelection/types'
import { useSleepContext } from 'context'
import { useCallback } from 'react'
import { PageRoutes } from 'routes'
import { useQueryParams } from 'hooks/useQueryParams'

export const useDateSelection = (): DateSelectionResponse => {
  const { updateQueryParam } = useQueryParams()
  const { setRangeStart, setRangeEnd } = useSleepContext()

  const setDateRange = useCallback((newStartDate: Date, newEndDate: Date) => {
    setRangeStart(newStartDate)
    setRangeEnd(newEndDate)

    updateQueryParam({
      route: PageRoutes.SLEEP,
      params: {
        start: newStartDate.getTime().toString(),
        end: newEndDate.getTime().toString()
      }
    })
  }, [setRangeEnd, setRangeStart, updateQueryParam])

  return {
    setDateRange
  }
}
import { DatePicker, } from 'antd'
import { useCallback } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useSleepContext } from 'context'
import { DateRangePickerProps } from './types'
import { useDateSelection } from 'modules/graph/hooks/useDateSelection'

export const DateRangePicker = ({ className }: DateRangePickerProps) => {
  const { sleepData } = useSleepContext()
  const { setDateRange } = useDateSelection()

  const handleChange = useCallback((dates: [start: Dayjs | null, end: Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      const newStartDate = dates[0].toDate()
      const newEndDate = dates[1].toDate()

      if (newStartDate.getTime() === newEndDate.getTime()) {
        const monthStart = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), 0)
        const monthEnd = new Date(newStartDate.getFullYear(), newStartDate.getMonth() + 1, 0)
        setDateRange(monthStart, monthEnd)
      } else {
        setDateRange(newStartDate, newEndDate)
      }
    }
  }, [setDateRange])

  return (
    <DatePicker.RangePicker
      size='small'
      picker='month'
      format='MMM YYYY'
      className={className}
      onChange={handleChange}
      maxDate={dayjs(sleepData?.latestSession)}
      minDate={dayjs(sleepData?.earliestSession)}
      defaultValue={[dayjs(sleepData?.latestSession).subtract(2, 'months'), dayjs(sleepData?.latestSession)]}
    />
  )
}
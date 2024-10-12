import {DatePicker, } from "antd";
import {useCallback} from "react";
import {DateRangePickerProps} from "modules/controls/DateRangePicker/types.ts";
import dayjs, {Dayjs} from "dayjs";
import {useQueryParams} from "hooks/useQueryParams";

export const DateRangePicker = ({ rangeStart, rangeEnd, onChange }: DateRangePickerProps) => {
  const { updateQueryParam } = useQueryParams()

  const handleChange = useCallback((dates: [start: Dayjs | null, end: Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      const newStartDate = dates[0].toDate()
      const newEndDate = dates[1].toDate()

      onChange(newStartDate, newEndDate)

      updateQueryParam({
        route: '/sleep',
        params: {
          start: newStartDate.getTime().toString(),
          end: newEndDate.getTime().toString()
        }
      })
    }
  }, [onChange, updateQueryParam])

  return (
    <DatePicker.RangePicker
      picker='month'
      onChange={handleChange}
      maxDate={dayjs(rangeEnd)}
      minDate={dayjs(rangeStart)}
      format='MMM YYYY'
      defaultValue={[dayjs(rangeEnd).subtract(2, 'months'), dayjs(rangeEnd)]}
    />
  )
}
import {DatePicker, } from "antd";
import {useCallback} from "react";
import {DateRangePickerProps} from "modules/controls/DateRangePicker/types.ts";
import dayjs, {Dayjs} from "dayjs";

export const DateRangePicker = ({ rangeStart, rangeEnd, onChange }: DateRangePickerProps) => {
  const handleChange = useCallback((dates: [start: Dayjs | null, end: Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      onChange(dates[0].toDate(), dates[1].toDate())
    }
  }, [onChange])

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
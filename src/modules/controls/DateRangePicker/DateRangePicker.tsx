import {DatePicker, } from "antd";
import {useCallback} from "react";
import dayjs, {Dayjs} from "dayjs";
import {useQueryParams} from "hooks/useQueryParams";
import {useSleepContext} from "context";
import {PageRoutes} from "routes.ts";

export const DateRangePicker = () => {
  const { updateQueryParam } = useQueryParams()
  const { setRangeStart, setRangeEnd, sleepData } = useSleepContext()

  const handleChange = useCallback((dates: [start: Dayjs | null, end: Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      const newStartDate = dates[0].toDate()
      const newEndDate = dates[1].toDate()

      setRangeStart(newStartDate)
      setRangeEnd(newEndDate)

      updateQueryParam({
        route: PageRoutes.SLEEP,
        params: {
          start: newStartDate.getTime().toString(),
          end: newEndDate.getTime().toString()
        }
      })
    }
  }, [setRangeEnd, setRangeStart, updateQueryParam])

  return (
    <DatePicker.RangePicker
      picker='month'
      onChange={handleChange}
      format='MMM YYYY'
      maxDate={dayjs(sleepData?.latestSession)}
      minDate={dayjs(sleepData?.earliestSession)}
      defaultValue={[dayjs(sleepData?.latestSession).subtract(2, 'months'), dayjs(sleepData?.latestSession)]}
    />
  )
}
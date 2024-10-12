export interface DateRangePickerProps {
  rangeStart: Date
  rangeEnd: Date
  onChange: (start: Date, end: Date) => void
}
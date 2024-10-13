export interface DateRangePickerProps {
  /**
   * The selected date that starts
   * the date range.
   */
  rangeStart: Date

  /**
   * The selected date that terminates
   * the date range.
   */
  rangeEnd: Date

  /**
   * A callback function that is invoked
   * when the user selects a date range
   * from the picker.
   *
   * @param start The selected start date.
   * @param end The selected end date.
   */
  onChange: (start: Date, end: Date) => void
}
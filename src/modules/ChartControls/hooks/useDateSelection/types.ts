export interface DateSelectionResponse {
  /**
   * Sets the active date range of the
   * rendered sessions in the context so
   * components can respond appropriately.
   * Also updates the query parameters in
   * the URI.
   *
   * @param start The new start date
   * @param end The new end date
   */
  setDateRange: (start: Date, end: Date) => void
}
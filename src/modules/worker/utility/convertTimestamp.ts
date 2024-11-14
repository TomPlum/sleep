/**
 * For some reason the raw Pillow database export
 * has fractional UNIX timestamps that have correct
 * dates and months but the years are 31 years in
 * the past.
 *
 * This function must be nested in its parent function
 * so it can be accessed in the same scope as the web worker.
 *
 * @param rawTimestamp The raw timestamp from the export.
 */
export const convertTimestamp = (rawTimestamp: number): Date => {
  const date = new Date(rawTimestamp * 1000)
  date.setFullYear(date.getFullYear() + 31)
  return date
}
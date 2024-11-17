/**
 * For some reason the raw Pillow database export
 * has fractional UNIX timestamps that have correct
 * dates and months but the years are 31 years in
 * the past.
 *
 * For example, the timestamp might be 557367577.554087,
 * which is Mon Aug 31 1987 01:19:37 GMT+0100 (British Summer Time).
 * Adding 31 years to this gives you 2018, when the sleep recordings started.
 *
 * @param rawTimestamp The raw timestamp from the export.
 */
export const convertTimestamp = (rawTimestamp: number): Date => {
  const date = new Date(rawTimestamp * 1000)
  date.setFullYear(date.getFullYear() + 31)
  return date
}
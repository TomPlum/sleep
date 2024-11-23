/**
 * Since Pillow is an iOS application, it uses the Cocoa Datetime API
 * from the Core Data storage framework. Timestamps from this API
 * are stored as seconds from January 1st 2001, unlike UNIX timestamps
 * which used milliseconds from January 1st 1970 00:00 (Epoch).
 *
 * For example, the timestamp might be 557367577.554087,
 * which is Mon Aug 31 1987 01:19:37 GMT+0100 (British Summer Time).
 * Adding 31 years to this gives you 2018, when the sleep recordings started.
 *
 * @param rawTimestamp The raw timestamp from the export.
 */
export const convertTimestamp = (rawTimestamp: number): Date => {
  const date = new Date(rawTimestamp * 1000) // <-- Convert seconds -> milliseconds
  date.setFullYear(date.getFullYear() + 31) // <-- (2001 - 1970) = 31 years, so add 31 years
  return date
}
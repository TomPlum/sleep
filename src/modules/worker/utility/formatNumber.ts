/**
 * Formats a numerical value into a prettier string
 * used on the UI. Adds commas in-between units.
 *
 * @param value The value to format.
 */
export const formatNumber = (value: number) => {
  return value.toLocaleString()
}
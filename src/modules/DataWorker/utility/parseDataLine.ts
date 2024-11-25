export type TableRow = Record<string, string | number>

/**
 * Parses a single line under a table inside the
 * raw Pillow database export.
 *
 * Rows look something like this:
 *
 * "Z_PK -> 1Z_ENT -> 15Z_OPT -> 3ZDURATION -> 10ZSLEEPSESSION -> 10ZSLEEPSTAGE -> 0.0"
 *
 * They're key -> value pairs but there are no spaces between the ends of
 * one value and the start of another key.
 *
 * @param line The line or "table row" from the data export.
 * @returns A record of all the key value pairs from the given line data.
 */
export const parseDataLine = (line: string): TableRow => {
  const regex = /(Z(?:_[A-Z]+|[A-Z]+)?)\s*->\s*([^Z]+)/g
  return Array.from(line.matchAll(regex)).reduce<TableRow>((row, match) => {
    const [ , key, value ] = match
    const sanitisedValue = value.trim()
    row[key] = isNaN(Number(sanitisedValue)) ? sanitisedValue : Number(sanitisedValue)
    return row
  }, {})
}
import {
  RawSleepDataTable,
  RawSleepSessionData,
  RawSleepSoundPointData, RawSleepStageData,
  TABLE_PRIMARY_KEY
} from 'data/useRawSleepData/types'

export interface ParsePillowDataProps {
  fileContents: string
}

export interface ParsePillowDataResult {
  sessions: Record<string, RawSleepSessionData>
  sounds: Record<string, RawSleepSoundPointData>
  stages: Record<string, RawSleepStageData>
}

type TableData <T> = Record<string, T>

type TableRow = Record<string, string | number>

/**
 * Parses a single line under a table inside the
 * raw Pillow database export.
 *
 * @param line The line or "table row" from the data export.
 */
const parseDataLine = (line: string): TableRow => {
  const regex = /(Z(?:_[A-Z]+|[A-Z]+)?)\s*->\s*([^Z]+)/g
  return Array.from(line.matchAll(regex)).reduce<TableRow>((row, match) => {
    const [ , key, value ] = match
    const sanitisedValue = value.trim()
    row[key] = isNaN(Number(sanitisedValue)) ? sanitisedValue : Number(sanitisedValue)
    return row
  }, {})
}

/**
 * Parses the export of the Pillow database file and extracts
 * data from a given table.
 *
 * @param fileContents The whole contents of the export file.
 */
export const parsePillowData = ({ fileContents }: ParsePillowDataProps): ParsePillowDataResult => {
  let readingTable : RawSleepDataTable | undefined = undefined
  let searchingForTable = true

  const result: Record<RawSleepDataTable, TableData<never>> = {}
  let currentTableData: TableData<never> = {}

  const targetTables = [
    RawSleepDataTable.SLEEP_SESSION,
    RawSleepDataTable.SOUND_DATA_POINTS,
    RawSleepDataTable.SLEEP_STAGES
  ]

  const lines = fileContents.split('\n')

  let lineIndex = 0

  while((searchingForTable || readingTable) && lineIndex < lines.length) {
    const line = lines[lineIndex]?.trim()

    // Has found a target table to start extracting data from
    if (searchingForTable && targetTables.includes(line as RawSleepDataTable)) {
      readingTable = line as RawSleepDataTable
      searchingForTable = false
    }

    // If we're currently reading, yet we hit a line that is a known table name, we're in the next table
    const hasReachedNextTable = !!readingTable && Object.values(RawSleepDataTable).includes(line as RawSleepDataTable) && Object.keys(currentTableData).length > 0

    // Indicates that the result already has all
    const hasReadAllTargetTables = targetTables.every(target => Object.keys(result).includes(target))

    // Has finished reading the current table
    if (readingTable && hasReachedNextTable) {
      // Decided if we should continue searching for another table
      searchingForTable = !hasReadAllTargetTables

      // Save the data from the table we're currently reading
      result[readingTable] = currentTableData

      // Reset the variable tracking the current table data for the next one
      currentTableData = {}

      // Decide if we're going to immediately continue reading consecutive tables, or stop while we search
      const isNextTableTarget = targetTables.includes(line as RawSleepDataTable)
      readingTable = isNextTableTarget ? line as RawSleepDataTable : undefined
    }

    if (!readingTable && hasReadAllTargetTables) {
      searchingForTable = false
    }

    if (readingTable && !Object.values(RawSleepDataTable).includes(line as RawSleepDataTable) && line !== '') {
      const dictionary = parseDataLine(line)
      const keyValue = dictionary[TABLE_PRIMARY_KEY] ?? '999'
      currentTableData[keyValue] = dictionary
    }

    lineIndex++
  }

  return {
    sessions: result[RawSleepDataTable.SLEEP_SESSION],
    sounds: result[RawSleepDataTable.SOUND_DATA_POINTS],
    stages: result[RawSleepDataTable.SLEEP_STAGES]
  }
}
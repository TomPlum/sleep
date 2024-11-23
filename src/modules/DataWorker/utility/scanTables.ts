import {
  Benchmark,
  DataWorkerStatusCode,
  ParsePillowDataProps,
  ParsePillowDataResult,
  TABLE_PRIMARY_KEY,
  parseDataLine,
  TableRow,
  sendMessage
} from 'modules/DataWorker'
import {
  RawSleepDataTable,
  RawSleepSessionData,
  RawSleepSoundPointData,
  RawSleepStageData
} from 'data/useRawSleepData/types'

export type TableData <T> = Record<string, T>

/**
 * Parses the export of the Pillow database file and extracts
 * data from a given table.
 *
 * @param fileContents The whole contents of the export file.
 */
export const scanTables = ({ fileContents }: ParsePillowDataProps): ParsePillowDataResult => {
  const benchmark = new Benchmark()
  benchmark.start()

  sendMessage({
    loading: true,
    status: {
      code: DataWorkerStatusCode.READ_TABLES,
      payload: 'Reading data tables'
    }
  })

  let readingTable : RawSleepDataTable | undefined = undefined
  let searchingForTable = true

  const result: Record<string, TableData<TableRow>> = {}
  let currentTableData: TableData<TableRow> = {}

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

    // If we're not in the middle of reading a table and all target tables have read, stop searching
    if (!readingTable && hasReadAllTargetTables) {
      searchingForTable = false
    }

    // If we're reading a table and the current line is not a table name, lets parse it as a table row
    if (readingTable && !Object.values(RawSleepDataTable).includes(line as RawSleepDataTable) && line !== '') {
      const dictionary = parseDataLine(line)
      const keyValue = dictionary[TABLE_PRIMARY_KEY] ?? '999'
      currentTableData[keyValue] = dictionary
    }

    // Once we're finished with the current line, increment to move onto the next one
    lineIndex++
  }

  benchmark.stop()

  sendMessage({
    loading: true,
    status: {
      code: DataWorkerStatusCode.READ_TABLES,
      payload: `Successfully read ${targetTables.length} tables in ${benchmark.delta}.`
    }
  })

  return {
    sessions: result[RawSleepDataTable.SLEEP_SESSION] as unknown as Record<string, RawSleepSessionData>,
    sounds: result[RawSleepDataTable.SOUND_DATA_POINTS] as unknown as Record<string, RawSleepSoundPointData>,
    stages: result[RawSleepDataTable.SLEEP_STAGES] as unknown as Record<string, RawSleepStageData>
  }
}
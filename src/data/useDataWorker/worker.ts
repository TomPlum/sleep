import { SleepSessionSound, SleepSessionStage, SleepStage } from 'data/useSleepData'
import { DataWorkerMessageEvent, DataWorkerResult, DataWorkerStatusCode } from 'data/useDataWorker'
import {
  RawSleepDataTable,
  RawSleepSessionData,
  RawSleepSoundPointData,
  RawSleepStageData
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

self.addEventListener('message', async () => {
  const TABLE_PRIMARY_KEY = 'Z_PK'

  const formatNumber = (value: number) => {
    return value.toLocaleString()
  }

  /**
   * Reads the contents of the raw database export
   * file. Reports the status and timings back to the
   * main thread for the loading screen.
   */
  const readFile = async () => {
    postMessage({
      loading: true,
      status: {
        statusCode: DataWorkerStatusCode.READING_FILE
      }
    })

    const timeStart = new Date()

    const fileName = `${self.location.origin}/PillowData-11-11-24.txt`
    const response = await fetch(fileName)

    if (!response.ok) {
      postMessage({
        error: new Error(`Failed to read ${fileName}`)
      })
    }

    const fileContents = await response.text()
    const fileSize = response.headers.get('Content-Length')

    const timeEnd = new Date()
    const timeDelta = timeEnd.getTime() - timeStart.getTime()

    postMessage({
      loading: true,
      status: {
        statusCode: DataWorkerStatusCode.READING_FILE,
        payload: `Successfully read ~${(Number(fileSize) / 1024 / 1024).toFixed(1)} MB in ${timeDelta}ms.`
      }
    })

    return {
      fileContents
    }
  }

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
  const scanTables = ({ fileContents }: ParsePillowDataProps): ParsePillowDataResult => {
    const startTime = new Date()

    postMessage({
      loading: true,
      status: {
        statusCode: DataWorkerStatusCode.READ_TABLES,
        payload: 'Reading data tables'
      }
    })

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

    const endTime = new Date()
    const timeDelta = endTime.getTime() - startTime.getTime()

    postMessage({
      loading: true,
      status: {
        statusCode: DataWorkerStatusCode.READ_TABLES,
        payload: `Successfully read ${targetTables.length} tables in ${timeDelta}ms.`
      }
    })

    return {
      sessions: result[RawSleepDataTable.SLEEP_SESSION],
      sounds: result[RawSleepDataTable.SOUND_DATA_POINTS],
      stages: result[RawSleepDataTable.SLEEP_STAGES]
    }
  }

  const parseTableData = ({ sessions, stages, sounds }: DataWorkerMessageEvent) => {
    const timeStart = new Date()

    /**
     * Converts the raw stage value into an enum value string.
     *
     * This function must be nested in its parent function
     * so it can be accessed in the same scope as the web worker.
     *
     * @param rawStageValue The raw stage numerical discriminator value.
     */
    const parseSleepStage = (rawStageValue: number): SleepStage => {
      switch (rawStageValue) {
        case 0.0: {
          return 'deep_sleep' as SleepStage
        }
        case 1.0: {
          return 'light_sleep' as SleepStage
        }
        case 2.0: {
          return 'rem_sleep' as SleepStage
        }
        case 3.0: {
          return 'awake_time' as SleepStage
        }
        default: {
          throw new Error(`Invalid Sleep Stage Value [${rawStageValue}]`)
        }
      }
    }

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
    const parseRawTimestamp = (rawTimestamp: number): Date => {
      const date = new Date(rawTimestamp * 1000)
      date.setFullYear(date.getFullYear() + 31)
      return date
    }

    const sessionKeys = Object.keys(sessions)
    const sessionCount = sessionKeys.length

    const getSoundsBySession = () => {
      const soundsBySession = new Map<number, SleepSessionSound[]>()

      postMessage({
        loading: true,
        status: {
          statusCode: DataWorkerStatusCode.EXTRACT_SOUND_DATA,
          payload: 'Extracting session sound data points...'
        }
      })

      Object.values(sounds).forEach(soundData => {
        const sessionId = soundData.ZSLEEPSESSION

        const soundEntry: SleepSessionSound = {
          id: soundData.ZUNIQUEIDENTIFIER,
          timestamp: parseRawTimestamp(soundData.ZTIMESTAMP),
          duration: soundData.ZDURATION,
        }

        if (!soundsBySession.has(sessionId)) {
          soundsBySession.set(sessionId, [])
        }

        soundsBySession.get(sessionId)!.push(soundEntry)
      })

      postMessage({
        loading: true,
        status: {
          statusCode: DataWorkerStatusCode.EXTRACT_SOUND_DATA,
          payload: `Extracted ${Object.keys(sounds).length} sound data points.`
        }
      })

      return soundsBySession
    }

    const getStagesBySession = () => {
      const stagesBySession = new Map<number, SleepSessionStage[]>()

      postMessage({
        loading: true,
        status: {
          statusCode: DataWorkerStatusCode.EXTRACT_STAGE_DATA,
          payload: 'Extracting session stage data points...'
        }
      })

      // Populate the stages map
      Object.values(stages).forEach(stageData => {
        const sessionId = stageData.ZSLEEPSESSION

        const stageEntry: SleepSessionStage = {
          id: stageData.ZUNIQUEIDENTIFIER,
          stage: parseSleepStage(stageData.ZSLEEPSTAGE),
          timestamp: parseRawTimestamp(stageData.ZTIMESTAMP),
        }

        if (!stagesBySession.has(sessionId)) {
          stagesBySession.set(sessionId, [])
        }

        stagesBySession.get(sessionId)!.push(stageEntry)
      })

      postMessage({
        loading: true,
        status: {
          statusCode: DataWorkerStatusCode.EXTRACT_STAGE_DATA,
          payload: `Extracted ${formatNumber(Object.keys(stages).length)} session stage instances.`
        }
      })

      return stagesBySession
    }

    setTimeout(() => {
      const stagesBySession = getStagesBySession()

      setTimeout(() => {
        const soundsBySession = getSoundsBySession()

        setTimeout(() => {
          postMessage({
            loading: true,
            status: {
              statusCode: DataWorkerStatusCode.ASSOCIATE_SESSION_DATA,
              percent: 0,
              payload: 'Processing sleep stage and sound data...',
            }
          })

          // Now reduce with preprocessed maps
          const result = sessionKeys.reduce<DataWorkerResult>((acc, sessionPrimaryKey, i) => {
            const sessionId = Number(sessionPrimaryKey)
            acc.sleepStages[sessionPrimaryKey] = stagesBySession.get(sessionId) || []
            acc.sounds[sessionPrimaryKey] = soundsBySession.get(sessionId) || []
            acc.sessions[sessionPrimaryKey] = sessions[sessionPrimaryKey]

            postMessage({
              loading: true,
              status: {
                statusCode: DataWorkerStatusCode.ASSOCIATE_SESSION_DATA,
                percent: ((i + 1) / sessionCount) * 100,
                payload: `Processing sleep stage and sound data for session ${i + 1}...`,
              }
            })

            return acc
          }, { sessions: {}, sleepStages: {}, sounds: {} })

          const timeEnd = new Date()
          const timeDelta = timeEnd.getTime() - timeStart.getTime()

          postMessage({
            loading: false,
            status: {
              statusCode: DataWorkerStatusCode.ASSOCIATE_SESSION_DATA,
              percent: 100,
              payload: `Processed ${formatNumber(sessionCount)} sleep sessions in ${timeDelta}ms.`
            }
          })

          setTimeout(() => {
            postMessage({
              result,
              loading: false,
              status: {
                statusCode: DataWorkerStatusCode.FINISHING,
                payload: 'Plotting sleep session graphs...',
                percent: 100,
              }
            })
          }, 1000)

          setTimeout(() => finish(result), 3500)
        }, 100)
      }, 100)
    }, 100)
  }

  const finish = (result: DataWorkerResult) => {
    return postMessage({
      result,
      loading: false,
      status: {
        statusCode: DataWorkerStatusCode.DONE,
        payload: 'Ready!',
        percent: 100
      }
    })
  }

  try {
    const { fileContents } = await readFile()

    setTimeout(() => {
      const { sessions, sounds, stages } = scanTables({ fileContents })

      setTimeout(() => {
        parseTableData({ sessions, sounds, stages })
      }, 100)
    }, 100)

  } catch (e) {
    return postMessage({
      error: e,
      loading: false,
      status: {
        statusCode: DataWorkerStatusCode.ERROR
      }
    })
  }
})
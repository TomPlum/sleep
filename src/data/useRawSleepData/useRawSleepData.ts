import { usePillowData } from 'data/usePillowData'
import { useMemo } from 'react'
import {
  RawSleepData,
  RawSleepDataTable,
  RawSleepSessionData,
  RawSleepSoundPointData,
  RawSleepStageData,
  TABLE_PRIMARY_KEY
} from 'data/useRawSleepData/types.ts'
import { SleepSessionStage, SleepStage } from 'data/useSleepData'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import dayjs from 'dayjs'

const parseDataLine = <T>(line: string): Record<string, T> => {
  const tokens = line.split(/\s+/)
  const row: Record<string, string> = {}

  while (tokens.length) {
    const valueParts: string[] = [tokens.pop()!] // Pop last token
    let valuePartOrSep = tokens.pop() // Should be '->'

    while (valuePartOrSep !== '->') {
      valueParts.push(valuePartOrSep!)
      valuePartOrSep = tokens.pop()
    }
    valueParts.reverse()

    const key = tokens.pop()!
    const joinedValueParts = valueParts.join(' ')
    row[key] = isNaN(Number(joinedValueParts)) ? joinedValueParts : Number(joinedValueParts)
  }

  return row
}

const parsePillowData = <T>(fileContents: string, key: string, table: string): Record<string, T> => {
  let readingTable = false
  let searchingForTable = true
  const tableData: Record<string, T> = {}

  const lines = fileContents.split('\n')
  let lineIndex = 0

  while(searchingForTable || readingTable) {
    const line = lines[lineIndex].trim()

    if (line === table) {
      readingTable = true
      searchingForTable = false
    }

    if (readingTable && Object.values(RawSleepDataTable).includes(line) && line !== table) {
      searchingForTable = false
      readingTable = false
    }

    if (readingTable && line !== table) {
      const dictionary = parseDataLine<T>(line)
      tableData[dictionary[key] ?? '999'] = dictionary
    }

    lineIndex++
  }

  return tableData
}

const parseSleepStage = (rawStageValue: number): SleepStage => {
  switch (rawStageValue) {
    case 0.0: {
      return SleepMetric.AWAKE_TIME
    }
    case 1.0: {
      return SleepMetric.REM_SLEEP
    }
    case 2.0: {
      return SleepMetric.LIGHT_SLEEP
    }
    case 3.0: {
      return SleepMetric.DEEP_SLEEP
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
 * @param rawTimestamp The raw timestamp from the export.
 */
const parseRawTimestamp = (rawTimestamp: number): Date => {
  // For some reason, one (or maybe more) of the timestamps have an ƒ character in them
  const sanitised = Number(rawTimestamp.toString().replace('ƒ', ''))
  return dayjs(new Date(sanitised * 1000)).add(31, 'years').toDate()
}

export const useRawSleepData = ({ fileContents }: { fileContents: string }): RawSleepData => {
  const { data, isLoading, error } = usePillowData({ type: 'raw' })

  const sleepStageData = useMemo<RawSleepStageData[]>(() => {
    const sessions = parsePillowData<RawSleepSessionData>(fileContents, TABLE_PRIMARY_KEY, RawSleepDataTable.SLEEP_SESSION)
    const stages =  parsePillowData<RawSleepSoundPointData>(fileContents, TABLE_PRIMARY_KEY, RawSleepDataTable.SOUND_DATA_POINTS)

    return Object.keys(sessions).map((sessionKey, i) => {
      const sessionSound = Object.values(stages).filter(stageData => {
        return stageData.ZSLEEPSESSION === Number(sessionKey)
      }).map<SleepSessionStage>(stageData => ({
        stage: parseSleepStage(stageData.ZSLEEPSTAGE),
        timestamp: parseRawTimestamp(stageData.ZTIMESTAMP),
        duration: stageData.ZDURATION
      }))

      return {
        stages: sessionSound,
        sessionId: `session-${i}`
      }
    })
  }, [fileContents])

  if (!data || isLoading || error) {
    return {
      loading: true,
      sleepStageData: []
    }
  }

  return {
    loading: isLoading,
    sleepStageData
  }
}
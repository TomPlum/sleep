import { usePillowData } from 'data/usePillowData'
import { useEffect, useMemo, useState } from 'react'
import {
  RawSleepData,
  RawSleepDataTable,
  RawSleepSessionData, RawSleepSessionSounds,
  RawSleepSoundPointData, RawSleepSessionStages,
  RawSleepStageData,
  TABLE_PRIMARY_KEY
} from './types'
import { SleepSessionSound, SleepSessionStage } from 'data/useSleepData'
import { useWorker } from '@koale/useworker'

const parseDataLine = (line: string): Record<string, string | number> => {
  const tokens = line.split(/\s+/)
  const row: Record<string, string | number> = {}

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

/**
 * Parses the export of the Pillow database file and extracts
 * data from a given table.
 *
 * @param fileContents The whole contents of the export file.
 * @param key The object key whose value should be used to store each record against (E.g. Z_PK).
 * @param table The name of the table to extract data from.
 */
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
      const dictionary = parseDataLine(line)
      const keyValue = dictionary[key] ?? '999'
      tableData[keyValue] = dictionary
    }

    lineIndex++
  }

  return tableData
}

interface ParseArgs {
  sessions: Record<string, RawSleepSessionData>
  stages: Record<string, RawSleepStageData>
  sound: Record<string, RawSleepSoundPointData>
}

const parse = ({ sessions, stages, sound }: ParseArgs) => {
  /**
   * Converts the raw stage value into an enum value string.
   *
   * This function must be nested in its parent function
   * so it can be accessed in the same scope as the web worker.
   *
   * @param rawStageValue The raw stage numerical discriminator value.
   */
  const parseSleepStage = (rawStageValue: number): string => {
    // TODO: Can we strongly type this inside the worker?
    switch (rawStageValue) {
      case 0.0: {
        return 'awake_time'
      }
      case 1.0: {
        return 'rem_sleep'
      }
      case 2.0: {
        return 'light_sleep'
      }
      case 3.0: {
        return 'deep_sleep'
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
    // For some reason, one (or maybe more) of the timestamps have an ƒ character in them
    // TODO: Check a fresh export, did I add this f character by accident while trying to crtl + f?
    const sanitised = Number(rawTimestamp.toString().replace('ƒ', ''))

    // TODO: Can we restore this dayjs logic while in the worker?
    // dayjs(new Date(sanitised * 1000)).add(31, 'years').toDate()
    const date = new Date(sanitised * 1000)
    date.setFullYear(date.getFullYear() + 31)

    return date
  }

  return Object.keys(sessions).reduce<ParsedData>((acc, sessionKey, i) => {
    const sessionStages = Object.values(stages).filter(stageData => {
      return stageData.ZSLEEPSESSION === Number(sessionKey)
    }).map<SleepSessionStage>(stageData => ({
      id: stageData.ZUNIQUEIDENTIFIER,
      stage: parseSleepStage(stageData.ZSLEEPSTAGE),
      timestamp: parseRawTimestamp(stageData.ZTIMESTAMP)
    }))

    const sessionSound = Object.values(sound).filter(soundData => {
      return soundData.ZSLEEPSESSION === Number(sessionKey)
    }).map<SleepSessionSound>(stageData => ({
      id: stageData.ZUNIQUEIDENTIFIER,
      timestamp: parseRawTimestamp(stageData.ZTIMESTAMP),
      duration: stageData.ZDURATION
    }))

    const sessionId = `session-${i}`

    acc.sleepStages[sessionId] = sessionStages
    acc.sounds[sessionId] = sessionSound

    return acc
  }, { sleepStages: {}, sounds: {} })
}

type ParsedData = {
  sleepStages: RawSleepSessionStages,
  sounds: RawSleepSessionSounds
}

export const useRawSleepData = (): RawSleepData => {
  const [parsedData, setParsedData] = useState<ParsedData>()
  const [workerInProgress, setWorkerInProgress] = useState(false)
  const { data, isLoading, error } = usePillowData({ type: 'raw' })

  const sessions = useMemo<Record<string, RawSleepSessionData>>(() => {
    if (!data) {
      return {}
    }

    return parsePillowData<RawSleepSessionData>(
      data,
      TABLE_PRIMARY_KEY,
      RawSleepDataTable.SLEEP_SESSION
    )
  }, [data])

  const sound = useMemo<Record<string, RawSleepSoundPointData>>(() => {
    if (!data) {
      return {}
    }

    return parsePillowData<RawSleepSoundPointData>(
      data,
      TABLE_PRIMARY_KEY,
      RawSleepDataTable.SOUND_DATA_POINTS
    )
  }, [data])

  const stages = useMemo<Record<string, RawSleepStageData>>(() => {
    if (!data) {
      return {}
    }

    return parsePillowData<RawSleepStageData>(
      data,
      TABLE_PRIMARY_KEY,
      RawSleepDataTable.SLEEP_STAGES
    )
  }, [data])

  const [triggerParserWorker] = useWorker<(args: ParseArgs) => ParsedData>(parse, {
    timeout: 60 * 1000
  })

  useEffect(() => {
    if (Object.keys(sessions).length > 0 && Object.keys(stages).length > 0  && Object.keys(sound).length > 0) {
      setWorkerInProgress(true)
      console.debug('Invoking web worker to load raw sleep data...')

      triggerParserWorker({ sessions, stages, sound })
        .then((result: ParsedData) => {
          console.debug(`Loaded ${Object.keys(result.sleepStages).length} sessions from raw data web worker.`)
          setParsedData(result)
        }).catch(e => {
          console.error('Failed to parse data in web worker', e)
        }).finally(() => {
          setWorkerInProgress(false)
        })
    }
  }, [sessions, sound, stages, triggerParserWorker])

  if (!data || isLoading || error) {
    return {
      loading: true,
      sessionStages: {},
      sessionSounds: {}
    }
  }

  return {
    loading: isLoading || workerInProgress,
    sessionStages: parsedData?.sleepStages ?? {},
    sessionSounds: parsedData?.sounds ?? {}
  }
}
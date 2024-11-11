import { usePillowData } from 'data/usePillowData'
import { useEffect, useMemo, useState } from 'react'
import {
  RawSleepData,
  RawSleepSessionData, RawSleepSessionSounds,
  RawSleepSoundPointData, RawSleepSessionStages,
  RawSleepStageData
} from './types'
import { SleepSessionSound, SleepSessionStage } from 'data/useSleepData'
import { useWorker } from '@koale/useworker'
import { parsePillowData, ParsePillowDataResult } from 'data/useRawSleepData/parsePillowData'

interface ParseArgs {
  sessions: Record<string, RawSleepSessionData>
  stages: Record<string, RawSleepStageData>
  sounds: Record<string, RawSleepSoundPointData>
}

const parse = ({ sessions, stages, sounds }: ParseArgs) => {
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
    // TODO: Reduce runtime complexity here by looping less
    const sessionStages = Object.values(stages).filter(stageData => {
      return stageData.ZSLEEPSESSION === Number(sessionKey)
    }).map<SleepSessionStage>(stageData => ({
      id: stageData.ZUNIQUEIDENTIFIER,
      stage: parseSleepStage(stageData.ZSLEEPSTAGE),
      timestamp: parseRawTimestamp(stageData.ZTIMESTAMP)
    }))

    const sessionSound = Object.values(sounds).filter(soundData => {
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

  const { sessions, stages, sounds } = useMemo<ParsePillowDataResult>(() => {
    if (!data) {
      return {
        sounds: {},
        stages: {},
        sessions: {}
      }
    }

    return parsePillowData({ fileContents: data })
  }, [data])

  const [triggerParserWorker] = useWorker<(args: ParseArgs) => ParsedData>(parse, {
    timeout: 60 * 1000
  })

  useEffect(() => {
    if (Object.keys(sessions).length > 0 && Object.keys(stages).length > 0  && Object.keys(sounds).length > 0) {
      setWorkerInProgress(true)
      console.debug('Invoking web worker to load raw sleep data...')

      triggerParserWorker({ sessions, stages, sounds })
        .then((result: ParsedData) => {
          console.debug(`Loaded ${Object.keys(result.sleepStages).length} sessions of stage data from raw data web worker.`)
          console.debug(`Loaded ${Object.keys(result.sounds).length} sound data points from raw data web worker.`)
          setParsedData(result)
        }).catch(e => {
          console.error('Failed to parse data in web worker', e)
        }).finally(() => {
          setWorkerInProgress(false)
        })
    }
  }, [sessions, sounds, stages, triggerParserWorker])

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
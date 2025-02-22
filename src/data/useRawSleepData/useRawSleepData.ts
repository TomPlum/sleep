import { RawSleepData } from './types'
import { useDataWorker } from 'modules/DataWorker'
import { useCallback, useMemo } from 'react'
import { PillowSleepSession, SleepMood } from 'data/useSleepData'
import dayjs from 'dayjs'
import { isValidSession } from 'data/isValidSession'

export const useRawSleepData = (): RawSleepData => {
  const { result, running } = useDataWorker()

  const getSleepMood = useCallback((moodValue: number): SleepMood => {
    switch (moodValue) {
      case 4: return SleepMood.GOOD
      case 3: return SleepMood.OK
      case 2: return SleepMood.BAD
      case 0: return SleepMood.UNKNOWN
      default: return SleepMood.UNKNOWN
    }
  }, [])

  const sessions = useMemo<PillowSleepSession[]>(() => {
    if (!result) {
      return []
    }

    // TODO: Are they any new pieces of data we want to map from the raw file? Like time to sleep?
    return Object.values(result.sessions).map((value) => {
      const ONE_MINUTE = 60

      const awake = value.ZTIMEAWAKE / ONE_MINUTE
      const deep = value.ZTIMEINDEEPSLEEP / ONE_MINUTE
      const light = value.ZTIMEINLIGHTSLEEP / ONE_MINUTE
      const rem = value.ZTIMEINREMSLEEP / ONE_MINUTE

      return ({
        id: value.Z_PK.toString(), // TODO: Z_PK or Z_UNIQUEIDENTIFIER here?
        startTime: dayjs(new Date(value.ZSTARTTIME * 1000)).add(31, 'years').toDate(),
        endTime: dayjs(new Date(value.ZENDTIME * 1000)).add(31, 'years').toDate(),
        audioRecordings: 0, // TODO: Do we have this from the raw session data? Or does it need linking from another table?
        isNap: value.ZISNAP === 1,
        mood: getSleepMood(value.ZWAKEUPMOOD),
        sleepQuality: Math.round(value.ZSLEEPQUALITY * 100),
        duration: {
          total: awake + deep + light + rem,
          awake,
          light,
          deep,
          rem
        }
      })
    }).filter(({ duration, isNap }) => {
      return isValidSession({ duration, isNap })
    })
  }, [result, getSleepMood])

  const { earliestSession, latestSession } = useMemo(() => {
    const earliestSession = new Date(Math.min(...sessions.map(session => session.startTime.getTime())))
    const latestSession = new Date(Math.max(...sessions.map(session => session.endTime.getTime())))

    return {
      earliestSession,
      latestSession
    }
  }, [sessions])

  return {
    loading: running,
    sleepData: {
      sessions,
      earliestSession,
      latestSession
    },
    sessionStages: result?.sleepStages ?? {},
    sessionSounds: result?.sounds ?? {}
  }
}
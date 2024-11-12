import { RawSleepData } from './types'
import { useDataWorker } from 'data/useDataWorker'
import { useCallback, useMemo } from 'react'
import { PillowSleepSession, SleepMood } from 'data/useSleepData'
import dayjs from 'dayjs'

export const useRawSleepData = (): RawSleepData => {
  const { result, status, running } = useDataWorker()

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

    console.log(Object.values(result.sessions))
    // TODO: Are they any new pieces of data we want to map from the raw file? Like time to sleep?
    return Object.values(result.sessions).map((value) => {
      const awake = value.ZTIMEAWAKE / 60
      const deep = value.ZTIMEINDEEPSLEEP / 60
      const light = value.ZTIMEINLIGHTSLEEP / 60
      const rem = value.ZTIMEINREMSLEEP / 60

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
      const hasValidDuration = duration.total > 0 && duration.total < (60 * 15)
      const hasInvalidBreakdown = [duration.light, duration.deep, duration.rem, duration.awake].every(v => v <= 0)
      const isAllAwakeTime = [duration.light, duration.deep, duration.rem].every(v => v === 0) && duration.awake > 0
      const hasValidAwakeTime = duration.awake <= duration.total
      const isTooShort = !isNap && duration.total < 90
      return hasValidDuration && !hasInvalidBreakdown && hasValidAwakeTime && !isTooShort && !isAllAwakeTime
    })
  }, [result, getSleepMood])

  console.log('sessions', sessions)
  console.log('stages', result?.sleepStages)

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
    status,
    sleepData: {
      sessions,
      earliestSession,
      latestSession
    },
    sessionStages: result?.sleepStages ?? {},
    sessionSounds: result?.sounds ?? {}
  }
}
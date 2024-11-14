import { usePillowData } from 'data/usePillowData'
import { useCallback, useMemo } from 'react'
import { PillowSleepSession, SleepDataResponse, SleepMood } from 'data/useSleepData/types'
import { isValidSession } from 'data/isValidSession'

export const useSleepData = (): SleepDataResponse => {
  const { data, isLoading, error } = usePillowData({ type: 'csv' })

  const getSleepMood = useCallback((moodValue: string): SleepMood => {
    switch (moodValue) {
      case 'Good': return SleepMood.GOOD
      case 'OK': return SleepMood.OK
      case 'Bad': return SleepMood.BAD
      case 'Undefined': return SleepMood.UNKNOWN
      default: return SleepMood.UNKNOWN
    }
  }, [])

  const sessions = useMemo<PillowSleepSession[]>(() => {
    if (!data) {
      return []
    }

    const rows = data.trim().split('\n')
    const values = rows.map(row => row.split(','))
    const headers = values[0]

    return values.slice(1).map((value) => {
      return value.reduce((rawSessionData: Record<string, string>, current, i) => {
        rawSessionData[headers[i].trim()] = current.trim()
        return rawSessionData
      }, {})
    }).map((record, i) => ({
      id: `session-${i}`,
      startTime: new Date(record['Start Time'].replace('Optional(', '').replace(')', '')),
      endTime: new Date(record['End Time'].replace('Optional(', '').replace(')', '')),
      audioRecordings: Number(record['Amount of audio recordings']),
      isNap: record['Is nap'] === 'Yes',
      mood: getSleepMood(record['Wake-up mood']),
      sleepQuality: Number(record['Sleep quality']),
      duration: {
        total: Number(record['Time in Bed (mins)']),
        awake: Number(record['Awake duration (mins)']),
        light: Number(record['Light sleep duration (mins)']),
        deep: Number(record['Deep sleep duration (mins)']),
        rem: Number(record['REM sleep duration (mins)']),
      }
    })).filter(({ duration, isNap }) => {
      return isValidSession({ duration, isNap })
    })
  }, [data, getSleepMood])

  const { earliestSession, latestSession } = useMemo(() => {
    const earliestSession = new Date(Math.min(...sessions.map(session => session.startTime.getTime())))
    const latestSession = new Date(Math.max(...sessions.map(session => session.endTime.getTime())))
    return {
      earliestSession,
      latestSession
    }
  }, [sessions])

  return {
    sleepData: {
      sessions,
      earliestSession,
      latestSession,
    },
    loading: isLoading,
    error
  }
}
import {usePillowData} from "data/usePillowData";
import { useMemo} from "react";
import { PillowSleepSession, SleepDataResponse} from "data/useSleepData/types.ts";

export const useSleepData = (): SleepDataResponse => {
  const { data, isLoading, error } = usePillowData({ type: 'csv' })

  const sessions: PillowSleepSession[] = useMemo(() => {
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
      mood: record['Wake-up mood'] === 'Undefined' ? undefined : record['Wake-up mood'],
      sleepQuality: Number(record['Sleep quality']),
      duration: {
        total: Number(record['Time in Bed (mins)']),
        awake: Number(record['Awake duration (mins)']),
        light: Number(record['Light sleep duration (mins)']),
        deep: Number(record['Deep sleep duration (mins)']),
        rem: Number(record['REM sleep duration (mins)']),
      }
    })).filter(({ duration }) => {
      // Sessions with 0 total duration are invalid
      const hasDuration = duration.total !== 0
      const hasValidBreakdown = [duration.light, duration.deep, duration.rem, duration.awake].every(v => v > 0)
      return hasDuration && hasValidBreakdown
    })
  }, [data])

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
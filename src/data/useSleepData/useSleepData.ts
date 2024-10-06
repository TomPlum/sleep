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
      return duration.total !== 0
    })
  }, [data])

  return {
    sleepData: {
      sessions
    },
    loading: isLoading,
    error
  }
}
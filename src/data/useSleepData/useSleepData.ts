import {usePillowData} from "data/usePillowData";
import {useMemo} from "react";

export const useSleepData = () => {
  const { data, isLoading, error } = usePillowData({ type: 'csv' })

  const sleepData = useMemo(() => {
    if (!data || isLoading) {
      return undefined
    }

    const rows = data.trim().split('\n')
    const values = rows.map(row => row.split(','))
    const headers = values[0]

    return values.slice(1).map((value) => {
      return value.reduce((acc: Record<string, string>, current, i) => {
        acc[headers[i]] = current
        return acc
      }, {})
    })
  }, [data, isLoading])

  return {
    sleepData,
    isLoading,
    error
  }
}
import { usePillowData } from "../usePillowData"
import { useCallback, useMemo } from "react"

/*const tables = [
  'ZPILLOWUSER',
  'ZSLEEPNOTE',
  'Z_5SLEEPSESSION',
  'ZSLEEPSESSION',
  'ZSLEEPSTAGEDATAPOINT',
  'ZSNOOZELAB',
  'ZSOUNDDATAPOINT',
  'Z_PRIMARYKEY',
  'Z_METADATA',
  'Z_MODELCACHE',
  'Y_UBMETA',
  'Y_UBRANGE',
  'Y_UBKVS'
]*/

const tables = [
  'ZPILLOWUSER',
  'Z_5SLEEPSESSION',
  'ZSLEEPSESSION',
  'ZSLEEPSTAGEDATAPOINT',
  'ZSOUNDDATAPOINT',
  'Z_PRIMARYKEY',
  'Z_METADATA',
  'Z_MODELCACHE',
  'Y_UBMETA',
  'Y_UBRANGE',
  'Y_UBKVS'
]

export const useRawSleepData = () => {
  const { data, isLoading, error } = usePillowData({ type: 'raw' })

  const parseLine = useCallback((line: string) => {
    const tokens = line.split(' ')
    const row: Record<string, string> = {}

    while(tokens.length > 0) {
      let valueParts = [tokens.pop()]
      let valuePartOrSeparator = tokens.pop()

      while(valuePartOrSeparator && valuePartOrSeparator != '->') {
        valueParts.push(valuePartOrSeparator)
        valuePartOrSeparator = tokens.pop()
      }

      valueParts = valueParts.reverse()

      const key = tokens.pop() ?? 'UNKNOWN'
      row[key] = valueParts.join(' ')
    }

    return row
  }, [])

  const sleepData = useMemo(() => {
    if (!data || isLoading) {
      return undefined
    }

    const dataFrames: Record<string, Array<Record<string, string>>> = {}
    let currentTable: string | undefined
    let rows: Array<Record<string, string>> = []

    data.split('\n').map(line => {
      const lineData = line.trim()

      if (tables.includes(lineData)) {
        if (currentTable) {
          dataFrames[currentTable] = rows
        }

        currentTable = lineData
        rows = []
      } else {
        rows.push(parseLine(lineData))
      }
    })

    dataFrames['ZSLEEPSESSION'].forEach(() => {

    })

    return rows
  }, [data, isLoading, parseLine])

  return {
    error,
    isLoading,
    sleepData
  }
}
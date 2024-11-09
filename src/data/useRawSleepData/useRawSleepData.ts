import { usePillowData } from '../usePillowData'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { RawSleepDataLoadEvent, RawSleepDataProps } from './types'
import { useWorker } from '@koale/useworker'

type PillowData = Record<string, any>[];
type ParsedPillowData = Record<string, PillowData>;

const parseLine = (line: string): Record<string, string | number> => {
  const tokens = line.split(/\s+/)
  const row: Record<string, string | number> = {}
  let key: string | undefined

  while (tokens.length > 0) {
    const valueParts: string[] = []

    // Collect value parts until we hit a separator
    while (tokens.length > 0) {
      const token = tokens.shift()
      if (token === '->') break // Stop when reaching the separator
      if (token) valueParts.push(token)
    }

    // After the separator, we can assume the next token is a key part
    if (tokens.length > 0) {
      const nextKeyPart = tokens.shift()
      if (nextKeyPart) {
        // Construct the key and its corresponding value
        const combinedKey = (key ? key : nextKeyPart).trim()
        const value = valueParts.join(' ').trim()

        // Handle possible numeric conversion
        row[combinedKey] = isNaN(Number(value)) ? value : Number(value)
        key = undefined // Reset the key after assignment
      }
    } else {
      // If no more tokens, we just assign the last value collected
      if (key) {
        row[key] = valueParts.join(' ')
      }
    }
  }

  return row
}

export const useRawSleepData = ({ onLoadEvent }: RawSleepDataProps) => {
  const { data, isLoading, error } = usePillowData({ type: 'raw' })

  const [line, setLine] = useState(0)
  const [parsedData, setParsedData] = useState()
  const [percentage, setPercentage] = useState(0)

  const [parseData, { kill }] = useWorker((fileContent: string, /*setProgress: (event: RawSleepDataLoadEvent) => void*/): ParsedPillowData => {
    const tables = [
      'ZPILLOWUSER', 'ZSLEEPNOTE', 'Z_2SLEEPSESSION', 'ZSLEEPSESSION',
      'ZSLEEPSTAGEDATAPOINT', 'ZSNOOZELAB', 'ZSOUNDDATAPOINT',
      'Z_PRIMARYKEY', 'Z_METADATA', 'Z_MODELCACHE', 'Y_UBMETA',
      'Y_UBRANGE', 'Y_UBKVS'
    ]

    const lines = fileContent.split('\n')
    let parsedLineCount = 0
    let currentTable: string | null = null
    const data: ParsedPillowData = {}
    let rows: PillowData = []

    for (const line of lines) {
      parsedLineCount++
      const trimmedLine = line.trim()

      // If we encounter a new table header
      if (tables.includes(trimmedLine)) {
        // Save the previous table's data if it exists
        if (currentTable) {
          data[currentTable] = rows
        }

        // Set the new current table and reset rows
        currentTable = trimmedLine
        rows = []
      } else if (trimmedLine === '') {
        // If we hit an empty line, we skip it
        continue
      } else if (currentTable) {
        // Only process lines if we have a current table
        rows.push(parseLine(trimmedLine))

        setProgress({
          done: false,
          percentage: (parsedLineCount / lines.length) * 100,
          line: parsedLineCount
        })
      }
    }

    // Final save for the last table processed
    if (currentTable) {
      data[currentTable] = rows
    }

    // Convert values to numbers where possible
    for (const table of Object.keys(data)) {
      data[table] = data[table].map((row) => {
        const parsedRow: Record<string, any> = {}
        for (const [key, value] of Object.entries(row)) {
          parsedRow[key] = isNaN(Number(value)) ? value : Number(value)
        }
        return parsedRow
      })
    }

    return data
  })

  const startParsing = useCallback(async () => {
    if (!data || isLoading) {
      return undefined
    }

    const parsed = await parseData(data/*, (progress: RawSleepDataLoadEvent) => {
        setPercentage(progress.percentage)
        setLine(progress.line)
      }*/)

    setParsedData(parsed)
  }, [data, isLoading, parseData])

  useEffect(() => {
    console.log('STARTING+')
    startParsing()

    return () => {
      kill()
    }
  }, [kill, startParsing])

  console.log('Loading raw data...', percentage, '%')

  return {
    error,
    isLoading,
    sleepData: parsedData,
    loading: {
      percent: percentage,
      line
    }
  }
}
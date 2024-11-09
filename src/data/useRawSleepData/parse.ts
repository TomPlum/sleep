import { usePillowData } from 'data/usePillowData'
import { useCallback } from 'react'

const tables = [
  'Z_5SLEEPSESSION',
  'Z_METADATA',
  'Z_MODELCACHE',
  'Y_UBMETA',
  'Y_UBRANGE',
  'Y_UBKVS',
  'ZSNOOZELAB',
  'ZSLEEPNOTE',
  'ZPILLOWUSER',
  'ZSOUNDDATAPOINT',
  'ACHANGE',
  'ATRANSACTION',
  'ATRANSACTIONSTRING',
  'ZSLEEPSTAGEDATAPOINT',
  'ZSLEEPSESSION',
  'ZSNOOZELABITEM',
  'ZSLEEPAIDLOG',
  'ZSLEEPAIDFAVORITETRACK',
  'ZALARM',
  'Z_PRIMARYKEY'
]

function getDictFromString(line: string): Record<string, string> {
  const tokens = line.split(/\s+/)
  const row: Record<string, string> = {}

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

function parsePillowData(fileContents: string, key: string, table: string) {
  let readingTable = false
  let searchingForTable = true
  const currentTableData = {}

  const lines = fileContents.split('\n')
  let lineIndex = 0

  while(searchingForTable || readingTable) {
    const line = lines[lineIndex].trim()

    if (line === table) {
      readingTable = true
      searchingForTable = false
    }

    if (readingTable && tables.includes(line) && line !== table) {
      searchingForTable = false
      readingTable = false
    }

    if (readingTable && line !== table) {
      const dictionary = getDictFromString(line)
      currentTableData[dictionary[key] ?? '999'] = dictionary
    }

    lineIndex++
  }

  return currentTableData
}

export const useParse = ({ fileContents }: { fileContents: string }) => {
  const { data, isLoading, error } = usePillowData({ type: 'raw' })

  const readTable = useCallback((table: string, key: string) => {
    return parsePillowData(fileContents, key, table)
  }, [fileContents])

  if (!data || isLoading || error) {
    return {
      isLoading: true,
      data: undefined,
      error
    }
  }

  return {
    isLoading,
    readTable
  }
}
import * as _ from 'lodash'
import { usePillowData } from 'data/usePillowData'

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
    row[key] = valueParts.join(' ')
  }

  return row
}

function parsePillowData(fileContents: string, table: string) {
  let readingTable = false
  const dataframes: Record<string, object> = {}
  const currentTableData = {}
  let startingIndex = 0

  fileContents.split('\n').forEach((line, i) => {
    line = line.trim()

    if (table.includes(line) && line === table) {
      readingTable = true
      startingIndex = i + 1
    }

    if (table.includes(line) && line !== table) {
      readingTable = false
    }

    if (readingTable) {
      // Check if we're at a new table heading
      if (table.includes(line) && line !== table) {
        // EOF or empty line, finish reading the last table
        dataframes[table] = currentTableData
      } else if (line !== table) {
        // Process the current line into the dictionary and add to rows
        const dictionary = getDictFromString(line)
        currentTableData[dictionary.Z_PK ?? '999'] = dictionary
      }
    }
  })

  // Convert column data if possible
  Object.keys(dataframes).forEach((key) => {
    const df = dataframes[key]
    // Reverse column order
    dataframes[key] = _.map(df, (row) => _.mapValues(row, (value) => isNaN(Number(value)) ? value : Number(value)))
  })

  return dataframes
}

export const useParse = ({ table }: { table: string }) => {
  const { data, isLoading, error } = usePillowData({ type: 'raw' })

  if (!data || isLoading || error) {
    return {
      isLoading: true,
      data: undefined,
      error
    }
  }

  return {
    isLoading,
    data: parsePillowData(data, table)
  }
}
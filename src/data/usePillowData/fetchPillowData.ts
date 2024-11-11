import { PillowDataType } from 'data/usePillowData/types'

export const fetchPillowData = async (type: PillowDataType) => {
  const fileName = type === 'raw' ? 'PillowData-11-11-24.txt' : 'PillowData-02-11-24.csv'
  const response = await fetch(fileName)

  if (!response.ok) {
    throw new Error('Failed to read sleep data.')
  }

  return await response.text()
}
import { PillowDataType } from 'data/usePillowData/types'
import { PILLOW_DATABASE_FILE_NAME } from 'modules/worker/hooks/useDataWorker'

export const fetchPillowData = async (type: PillowDataType) => {
  const fileName = type === 'raw' ? PILLOW_DATABASE_FILE_NAME : 'PillowData-02-11-24.csv'
  const response = await fetch(fileName)

  if (!response.ok) {
    throw new Error('Failed to read sleep data.')
  }

  return await response.text()
}
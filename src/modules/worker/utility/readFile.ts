import { DataWorkerStatusCode, PILLOW_DATABASE_FILE_NAME } from 'modules/worker'
import { PillowDataType } from 'data/usePillowData/types'

/**
 * Reads the Pillow export file of the given type.
 * @param type The type of file to read (CSV or TXT).
 */
export const readFile = async (type: PillowDataType) => {
  const fileName = type === 'raw' ? PILLOW_DATABASE_FILE_NAME : 'PillowData-02-11-24.csv'
  const contextUrl = import.meta.env.MODE === 'production' ? '/sleep' : ''
  const filePath = `${self.location.origin}${contextUrl}/${fileName}`
  const response = await fetch(filePath)

  if (!response.ok) {
    postMessage({
      error: new Error(`Failed to read ${filePath}`)
    })
  }

  return response
}

/**
 * Reads the contents of the raw database export
 * file. Reports the status and timings back to the
 * main thread for the loading screen.
 */
export const readRawDatabaseExport = async () => {
  postMessage({
    loading: true,
    status: {
      code: DataWorkerStatusCode.READING_FILE
    }
  })

  const timeStart = new Date()

  const response = await readFile('raw')

  const fileContents = await response.text()
  const fileSize = response.headers.get('Content-Length')

  const timeEnd = new Date()
  const timeDelta = timeEnd.getTime() - timeStart.getTime()

  postMessage({
    loading: true,
    status: {
      code: DataWorkerStatusCode.READING_FILE,
      payload: `Successfully read ~${(Number(fileSize) / 1024 / 1024).toFixed(1)} MB in ${timeDelta}ms.`
    }
  })

  return {
    fileContents
  }
}
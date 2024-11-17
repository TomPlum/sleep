import { Benchmark, DataWorkerStatusCode, PILLOW_DATABASE_FILE_NAME } from 'modules/worker'
import { PillowDataType } from 'data/usePillowData/types'
import { isProduction } from 'env.ts'

/**
 * Reads the Pillow export file of the given type.
 * @param type The type of file to read (CSV or TXT).
 */
export const readFile = async (type: PillowDataType) => {
  const fileName = type === 'raw' ? PILLOW_DATABASE_FILE_NAME : 'PillowData-02-11-24.csv'
  const contextUrl = isProduction() ? '/sleep' : ''
  const filePath = `${self.location.origin}${contextUrl}/${fileName}`
  const response = await fetch(filePath)

  if (!response.ok) {
    self.postMessage({
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

  const benchmark = new Benchmark()
  benchmark.start()

  const response = await readFile('raw')

  const fileContents = await response.text()
  const fileSize = new Blob([fileContents]).size

  benchmark.stop()

  postMessage({
    loading: true,
    status: {
      code: DataWorkerStatusCode.READING_FILE,
      payload: `Successfully read ~${(Number(fileSize) / 1024 / 1024).toFixed(1)} MB in ${benchmark.delta}.`
    }
  })

  return {
    fileContents
  }
}
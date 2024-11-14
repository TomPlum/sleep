import { DataWorkerStatusCode, PILLOW_DATABASE_FILE_NAME } from 'modules/worker/hooks/useDataWorker/types'

/**
 * Reads the contents of the raw database export
 * file. Reports the status and timings back to the
 * main thread for the loading screen.
 */
export const readFile = async () => {
  postMessage({
    loading: true,
    status: {
      code: DataWorkerStatusCode.READING_FILE
    }
  })

  const timeStart = new Date()

  const contextUrl = import.meta.env.MODE === 'production' ? '/sleep' : ''
  const fileName = `${self.location.origin}${contextUrl}/${PILLOW_DATABASE_FILE_NAME}`
  const response = await fetch(fileName)

  if (!response.ok) {
    postMessage({
      error: new Error(`Failed to read ${fileName}`)
    })
  }

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
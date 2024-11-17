import { useEffect, useState } from 'react'
import {
  DataWorkerResponse,
  DataWorkerStatusCode,
  UseDataWorkerResponse
} from './types'
import DataWorker from 'modules/worker/worker?worker'

export const dataWorker = new DataWorker()

export const useDataWorker = (): UseDataWorkerResponse => {
  const [running, setRunning] = useState(true)
  const [result, setResult] = useState<DataWorkerResponse>()

  useEffect(() => {
    const onMessage = (event: MessageEvent<DataWorkerResponse>) => {
      if (event.data?.status?.code === DataWorkerStatusCode.DONE) {
        setRunning(false)
      }

      setResult(event.data)
    }

    dataWorker.addEventListener('message', onMessage)

    console.debug('Starting web worker to read Pillow database export...')
    dataWorker.postMessage('Starting worker')

    return () => dataWorker.removeEventListener('message', onMessage)
  }, [])

  return {
    running,
    result: {
      sessions: result?.result?.sessions ?? {},
      sounds: result?.result?.sounds ?? {},
      sleepStages: result?.result?.sleepStages ?? {}
    }
  }
}
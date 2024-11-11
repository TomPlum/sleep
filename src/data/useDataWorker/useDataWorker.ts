import { useEffect, useRef, useState } from 'react'
import {
  DataWorkerResponse,
  DataWorkerStatus,
  DataWorkerStatusCode,
  UseDataWorkerResponse
} from 'data/useDataWorker/types'
import DataWorker from './worker?worker'

const dataWorker = new DataWorker()

export const useDataWorker = (): UseDataWorkerResponse => {
  const initialised = useRef(false)

  const [error, setError] = useState<Error>()
  const [running, setRunning] = useState(true)
  const [result, setResult] = useState<DataWorkerResponse>()
  const [status, setStatus] = useState<DataWorkerStatus>({
    percent: 0,
    statusCode: DataWorkerStatusCode.NOT_STARTED
  })

  useEffect(() => {
    const onMessage = (event: MessageEvent<DataWorkerResponse>) => {
    /*  if (initialised.current) {
        return
      }*/

      initialised.current = true

      if (event.data?.status?.statusCode === DataWorkerStatusCode.DONE) {
        setRunning(false)
      }

      setError(event.data.error)
      setResult(event.data)
      setStatus(event.data.status)
    }

    dataWorker.addEventListener('message', onMessage)

    console.debug('Starting web worker to read Pillow database export...')
    dataWorker.postMessage('Starting worker')

    return () => dataWorker.removeEventListener('message', onMessage)
  }, [])

  return {
    running,
    error,
    status,
    result: {
      sounds: result?.result?.sounds ?? {},
      sleepStages: result?.result?.sleepStages ?? {}
    }
  }
}
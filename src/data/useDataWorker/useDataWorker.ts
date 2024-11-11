import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DataWorkerMessageEvent,
  DataWorkerResponse, DataWorkerStatus,
  UseDataWorkerResponse
} from 'data/useDataWorker/types'
import worker, { DataWorkerStatusCode } from './worker'

export const useDataWorker = (): UseDataWorkerResponse => {
  const [error, setError] = useState<Error>()
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<DataWorkerResponse>()
  const [status, setStatus] = useState<DataWorkerStatus>({
    percent: 0,
    statusCode: DataWorkerStatusCode.NOT_STARTED
  })

  const dataWorker = useMemo(() => {
    const code = worker.toString()
    const blob = new Blob(['(' + code + ')()'])
    return new Worker(URL.createObjectURL(blob))
  }, [])

  const startProcessing = useCallback((data: DataWorkerMessageEvent) => {
    setRunning(true)
    dataWorker.postMessage(data)
  }, [dataWorker])

  useEffect(() => {
    const onMessage = (event: MessageEvent<DataWorkerResponse>) => {
      setRunning(event.data.loading)
      setError(event.data.error)
      setResult(event.data)
      setStatus(event.data.status)
    }

    dataWorker.addEventListener('message', onMessage)

    return () => dataWorker.removeEventListener('message', onMessage)
  }, [dataWorker])

  return {
    startProcessing,
    running,
    error,
    status,
    result: {
      sounds: result?.result?.sounds ?? {},
      sleepStages: result?.result?.sleepStages ?? {}
    }
  }
}
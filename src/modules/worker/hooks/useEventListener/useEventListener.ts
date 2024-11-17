import { useEffect, useState } from 'react'
import { DataWorkerResponse, DataWorkerStatus, DataWorkerStatusCode, dataWorker } from 'modules/worker'

export const useEventListener = () => {
  const [status, setStatus] = useState<DataWorkerStatus>({
    percent: 0,
    code: DataWorkerStatusCode.NOT_STARTED,
    payload: 'Sent message to startup web-worker.'
  })

  const [state, setState] = useState<DataWorkerStatus[]>([])

  useEffect(() => {
    const onMessage = (event: MessageEvent<DataWorkerResponse>) => {
      setState(current => [...current, event.data.status])
      setStatus(event.data.status)
    }

    dataWorker.addEventListener('message', onMessage)

    console.debug('Starting web worker to read Pillow database export...')

    setStatus({
      code: DataWorkerStatusCode.STARTING,
      percent: 0,
      payload: 'Pillow raw database web-worker initialised.'
    })

    return () => dataWorker.removeEventListener('message', onMessage)
  }, [])

  return {
    state,
    status
  }
}
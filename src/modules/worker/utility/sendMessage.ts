import { DataWorkerResponse } from 'modules/worker/hooks/useDataWorker'

export const sendMessage = (message: DataWorkerResponse) => {
  postMessage(message)
}
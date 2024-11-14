import { DataWorkerResponse } from 'modules/worker'

export const sendMessage = (message: DataWorkerResponse) => {
  postMessage(message)
}
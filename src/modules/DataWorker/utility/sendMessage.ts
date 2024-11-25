import { DataWorkerResponse } from 'modules/DataWorker'

/**
 * A wrapper function around {@link self.postMessage}
 * to strongly type the message payload send through it.
 *
 * @param message The message to send from the data worker to the main thread.
 */
export const sendMessage = (message: DataWorkerResponse) => {
  self.postMessage(message)
}
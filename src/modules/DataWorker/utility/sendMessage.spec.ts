import { DataWorkerResponse, DataWorkerStatusCode, sendMessage } from 'modules/DataWorker'

describe('Send Message Wrapper Function', () => {
  it('should call postMessage with the given body', () => {
    const postMessageSpy = vi.fn()
    self.postMessage = postMessageSpy

    const message: DataWorkerResponse = {
      loading: true,
      status: {
        code: DataWorkerStatusCode.READ_TABLES,
        payload: 'Reading tables...',
        percent: 55,
        loading: true
      },
      error: undefined
    }

    sendMessage(message)

    expect(postMessageSpy).toHaveBeenCalledWith<DataWorkerResponse[]>(message)
  })
})
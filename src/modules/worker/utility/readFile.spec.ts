import { beforeEach, describe } from 'vitest'
import { readFile } from 'modules/worker'
import * as env from 'env'

describe('Read File Utility', () => {
  const fetch =  vi.fn()
  const postMessage = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetch)

    vi.stubGlobal('self', {
      location: {
        origin: 'http://localhost:3000',
      },
      postMessage
    })

    vi.spyOn(env, 'isProduction').mockReturnValueOnce(false)
  })

  it('should read the TXT file when the type is raw', async () => {
    const fileContents = 'test-contents'

    fetch.mockReturnValue({
      ok: true,
      text: vi.fn().mockReturnValue(fileContents)
    })

    const file = await readFile('raw')

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/PillowData-11-11-24.txt')
    expect(file.text()).toBe(fileContents)
  })

  it('should read the CSV file when the type is csv', async () => {
    const fileContents = 'test-contents'

    fetch.mockReturnValue({
      ok: true,
      text: vi.fn().mockReturnValue(fileContents)
    })

    const file = await readFile('csv')

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/PillowData-02-11-24.csv')
    expect(file.text()).toBe(fileContents)
  })

  it('should prefix the file URL with self.location.origin if it is present', async () => {
    fetch.mockReturnValue({
      ok: true,
      text: vi.fn().mockReturnValue('test-contents')
    })

    Object.defineProperty(self, 'location', {
      value: {
        origin: 'https://localhost:5173/custom-web-worker-origin'
      }
    })

    await readFile('raw')

    expect(fetch).toHaveBeenCalledWith('https://localhost:5173/custom-web-worker-origin/PillowData-11-11-24.txt')
  })

  it('should append the context URL if the mode is production', async () => {
    fetch.mockReturnValue({
      ok: true,
      text: vi.fn().mockReturnValue('test-contents')
    })

    vi.spyOn(env, 'isProduction').mockReturnValue(true)

    Object.defineProperty(self, 'location', {
      value: {
        origin: 'https://localhost:5173/custom-web-worker-origin'
      }
    })

    await readFile('raw')

    expect(fetch).toHaveBeenCalledWith('https://localhost:5173/custom-web-worker-origin/sleep/PillowData-11-11-24.txt')
  })

  it('should postMessage with an error if the response is not ok', async () => {
    fetch.mockReturnValue({
      ok: false, // <-- Things are not ok
      text: vi.fn().mockReturnValue('test-contents')
    })

    await readFile('raw')

    expect(postMessage).toHaveBeenCalledWith({
      error: new Error('Failed to read http://localhost:3000/PillowData-11-11-24.txt')
    })
  })
})
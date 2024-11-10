import { beforeAll, beforeEach } from 'vitest'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { parsePillowData } from 'data/useRawSleepData/parsePillowData'

describe('Parse Raw Pillow Data', () => {
  let pillowData: string

  beforeAll(() => {
    try {
      const filePath = resolve(__dirname, '../../test/PillowDataRaw.txt')
      pillowData = readFileSync(filePath, 'utf8')
    } catch (e) {
      console.error('Failed to setup useRawSleepData.spec.ts as the data could not be read', e)
    }
  })

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => {
      return Promise.resolve({
        ok: true,
        text: () => {
          return Promise.resolve(pillowData)
        }
      })
    }))
  })

  it('should', () => {
    const { sounds, sessions, stages } = parsePillowData({
      fileContents: pillowData
    })

    expect(sessions).toStrictEqual([])
  })
})
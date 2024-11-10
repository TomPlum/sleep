import { renderHook, waitFor } from '@testing-library/react'
import { useRawSleepData } from './useRawSleepData'
import { wrapper } from 'test'
import { beforeAll, beforeEach } from 'vitest'
import { resolve } from 'path'
import { readFileSync } from 'fs'

describe('Sleep Data Parsing Hook', () => {
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

  it('should return stage and sound data from the raw data export', async () => {
    const { result } = renderHook(useRawSleepData, { wrapper })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })


    expect(result.current.sessionStages).toStrictEqual([])
    expect(result.current.sessionSounds).toStrictEqual([])
  })
})
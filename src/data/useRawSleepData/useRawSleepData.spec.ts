import {renderHook, waitFor} from "@testing-library/react";
import {useRawSleepData} from "./useRawSleepData.ts";
import {wrapper} from "test";
import {beforeAll, beforeEach} from "vitest";
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

  it.skip('should return something', async () => {
    const { result } = renderHook(useRawSleepData, { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    }, { timeout: 10000 })

    expect(result.current.sleepData).toStrictEqual([])
  },  { timeout: 10000 })
})
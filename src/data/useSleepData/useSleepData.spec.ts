import {beforeAll, beforeEach} from "vitest";
import {resolve} from "path";
import {readFileSync} from "fs";
import {renderHook, waitFor} from "@testing-library/react";
import {useRawSleepData} from "data/useRawSleepData";
import {wrapper} from "test";
import {useSleepData} from "data/useSleepData/useSleepData.ts";

describe('Sleep Data (CSV) Parsing Hook', () => {
  let pillowData: string

  beforeAll(() => {
    try {
      const filePath = resolve(__dirname, '../../test/PillowData.csv')
      pillowData = readFileSync(filePath, 'utf8')
    } catch (e) {
      console.error('Failed to setup useSleepData.spec.ts as the data could not be read', e)
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

  it('should return something', async () => {
    const { result } = renderHook(useSleepData, { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.sleepData).toStrictEqual([])
  })
})
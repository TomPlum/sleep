import { renderHook, waitFor } from '@testing-library/react'
import { useRawSleepData } from './useRawSleepData'
import { wrapper } from 'test'
import { beforeAll, beforeEach } from 'vitest'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { parsePillowFile, useParse } from 'data/useRawSleepData/parse.ts'

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

  it('should return something', async () => {
    const { result } = renderHook(useRawSleepData, { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.sleepData).toStrictEqual([])
  })

  it('test', async () => {
    const { result } = renderHook(() => useParse({ table: 'ZSLEEPSESSION' }), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Z_PK -> 9245
    // Z_ENT -> 6
    // Z_OPT -> 1
    // ZALARMENABLED -> 0
    // ZALARMTYPERAW -> 0
    // ZAUDIORECORDINGENABLED -> 0
    // ZAUTOMATICSESSION -> 1
    // ZGROSSMOTIONSINSESSION -> 2
    // ZISEDITED -> 0
    // ZISNAP -> 0
    // ZNAPTYPERAW -> -1
    // ZNUMBEROFAWAKENINGS -> 1
    // ZNUMBEROFSNOOZES -> 0
    // ZPHYSICALACTIVITYORIGIN -> 0
    // ZSLEEPAIDENABLED -> 0
    // ZSYNCEDTORUNKEEPER -> 0
    // ZUSEDAPPLEWATCH -> 1
    // ZWAKEUPMOOD -> 0
    // ZDURATION -> 0.0
    // ZENDTIME -> 749892761.925443
    // ZFATIGUE -> 0.0
    // ZSLEEPQUALITY -> 0.740000009536743
    // ZSMARTWAKEUPDURATION -> 0.0
    // ZSTARTTIME -> 749874967.307821
    // ZTIMEAWAKE -> 1020.0
    // ZTIMEAWAKEUNTILSTOPPING -> 0.0
    // ZTIMEINDEEPSLEEP -> 6000.0
    // ZTIMEINLIGHTSLEEP -> 7200.0
    // ZTIMEINREMSLEEP -> 3540.0
    // ZTIMETOSLEEP -> 0.0
    // ZDEVICEUSED -> iPhone14,3
    // ZTIMEZONEIDENTIFIER -> Europe/London
    // ZUNIQUEIDENTIFIER -> D0FE9F1A-3E86-437E-85D2-B3339B101CCF
    // ZPRODUCEDBYAPPLEWATCH -> 0
    // ZSOURCEID -> 5DC1ABED
    // ZANALYSISALGORITHMRAW -> 0
    // ZMORPHEUSVERSIONUSED -> Auto-D_v13-An_v9
    // ZSLEEPTRACKINGMETHODRAW -> 1

    const id = '529f9ec26d4c208d8ae8638ca230bc26'
    const data = result.current.data
    const session = data?.ZSLEEPSESSION.find(session => session.ZUNIQUEIDENTIFIER === id)
    const sleepStageData = data?.ZSLEEPSTAGEDATAPOINT.find(session => session.ZUNIQUEIDENTIFIER === id)

    expect(result.current.data).toStrictEqual([])
  })
})
import { renderHook, waitFor } from '@testing-library/react'
import { useRawSleepData } from './useRawSleepData'
import { wrapper } from 'test'

describe('Sleep Data Parsing Hook', () => {
  it('should return stage and sound data from the raw data export', async () => {
    const { result } = renderHook(useRawSleepData, { wrapper })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })


    expect(result.current.sessionStages).toStrictEqual([])
    expect(result.current.sessionSounds).toStrictEqual([])
  })
})
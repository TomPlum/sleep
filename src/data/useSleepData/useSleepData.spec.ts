import { beforeAll, beforeEach } from 'vitest'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { renderHook, waitFor } from '@testing-library/react'
import { wrapper } from 'test'
import { useSleepData } from 'data/useSleepData/useSleepData'
import { SleepDataResponse } from 'data/useSleepData/types'

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

  it('should return a valid set of sleep data in the correct format', async () => {
    const { result } = renderHook(useSleepData, { wrapper })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current).toStrictEqual<SleepDataResponse>({
      loading: false,
      error: null,
      sleepData: {
        'earliestSession': new Date('2018-08-16T22:16:57.000Z'),
        'latestSession': new Date('2018-08-21T06:00:21.000Z'),
        sessions: [
          {
            'audioRecordings': 65,
            'duration': {
              'awake': 90,
              'deep': 130,
              'light': 170,
              'rem': 50,
              'total': 440,
            },
            'endTime': new Date('2018-08-17T05:36:42.000Z'),
            'id': 'session-0',
            'isNap': false,
            'mood': 'OK',
            'sleepQuality': 56,
            'startTime': new Date('2018-08-16T22:16:57.000Z'),
          },
          {
            'audioRecordings': 69,
            'duration': {
              'awake': 885,
              'deep': 330,
              'light': 190,
              'rem': 90,
              'total': 513,
           },
            'endTime': new Date('2018-08-18T06:31:27.000Z'),
            'id': 'session-1',
            'isNap': false,
            'mood': 'OK',
            'sleepQuality': 50,
            'startTime': new Date('2018-08-17T21:57:59.000Z'),
          },
          {
            'audioRecordings': 12,
            'duration': {
              'awake': 67,
              'deep': 190,
              'light': 190,
              'rem': 70,
              'total': 517,
            },
            'endTime': new Date('2018-08-19T07:30:35.000Z'),
            'id': 'session-2',
            'isNap': false,
            'mood': 'Good',
            'sleepQuality': 72,
            'startTime': new Date('2018-08-18T22:53:27.000Z'),
          },
          {
            'audioRecordings': 5,
            'duration': {
              'awake': 102,
              'deep': 150,
              'light': 160,
              'rem': 30,
              'total': 442,
            },
            'endTime': new Date('2018-08-20T06:00:39.000Z'),
            'id': 'session-3',
            'isNap': false,
            'mood': undefined,
            'sleepQuality': 56,
            'startTime': new Date('2018-08-19T22:38:42.000Z'),
          },
          {
            'audioRecordings': 9,
            'duration': {
              'awake': 45,
              'deep': 150,
              'light': 240,
              'rem': 70,
              'total': 505,
            },
            'endTime': new Date('2018-08-21T06:00:21.000Z'),
            'id': 'session-4',
            'isNap': false,
            'mood': 'Good',
            'sleepQuality': 76,
            'startTime': new Date('2018-08-20T21:35:34.000Z'),
          }
        ]
      }
    })
  })
})
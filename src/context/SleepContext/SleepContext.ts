import { createContext } from 'react'
import { SleepContextBag } from 'context/SleepContext/types'

export const SleepContext = createContext<SleepContextBag>({
  sleepData: {
    sessions: [],
    earliestSession: new Date(),
    latestSession: new Date()
  },
  sleepStageData: {},
  sleepSoundData: {},
  selectedSession: undefined,
  isSleepDataLoading: true,
  activeSessions: 0,
  graphData2d: {
    data: [],
    earliestSession: new Date(),
    latestSession: new Date(),
    isSleepDataLoading: true
  },
  improvementDate: new Date()
})
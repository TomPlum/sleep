import { createContext } from 'react'
import { SleepContextBag } from 'context/types'
import { SleepMetric } from 'modules/controls/MetricConfiguration'

export const SleepContext = createContext<SleepContextBag>({
  sleepData: {
    sessions: [],
    earliestSession: new Date(),
    latestSession: new Date()
  },
  isSleepDataLoading: true,
  rangeStart: new Date(),
  setRangeStart: (start: Date) => {
    console.debug(`Tried to setRangeStart(${start}) in the SleepContext before initialisation.`)
  },
  rangeEnd: new Date(),
  setRangeEnd: (start: Date) => {
    console.debug(`Tried to setRangeEnd(${start}) in the SleepContext before initialisation.`)
  },
  sleepMetric: SleepMetric.QUALITY,
  setSleepMetric: (metric: SleepMetric) => {
    console.debug(`Tried to setSleepMetric(${metric}) in the SleepContext before initialisation.`)
  },
  activeSessions: 0,
  graphData2d: {
    data: [],
    earliestSession: new Date(),
    latestSession: new Date(),
    isSleepDataLoading: true
  },
  improvementDate: new Date(),

  stackedView: false,
  setStackedView: (stackedView: boolean) => {
    console.debug(`Tried to setStackedView(${stackedView}) in the SleepContext before initialisation.`)
  },
  stackedMetrics: [SleepMetric.QUALITY],
  setStackedMetrics: () => {
    console.debug('Tried to setStackedMetrics() in the SleepContext before initialisation.')
  }
})
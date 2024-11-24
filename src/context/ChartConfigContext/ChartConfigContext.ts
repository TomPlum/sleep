import { createContext } from 'react'
import { ChartConfigContextBag } from 'context/ChartConfigContext/types'
import { SleepMetric } from 'modules/ChartControls/components/MetricConfiguration'

export const ChartConfigContext = createContext<ChartConfigContextBag>({
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
  stackedView: false,
  setStackedView: (stackedView: boolean) => {
    console.debug(`Tried to setStackedView(${stackedView}) in the SleepContext before initialisation.`)
  },
  stackedMetrics: [SleepMetric.QUALITY],
  setStackedMetrics: () => {
    console.debug('Tried to setStackedMetrics() in the SleepContext before initialisation.')
  }
})
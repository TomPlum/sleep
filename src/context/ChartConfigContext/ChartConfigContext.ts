import { createContext } from 'react'
import { ChartConfigContextBag } from 'context/ChartConfigContext/types'
import { SleepMetric } from 'modules/ChartControls/components/MetricConfiguration'
import { ChartView } from 'modules/ChartControls/components/ChartViewSelector/types'

export const ChartConfigContext = createContext<ChartConfigContextBag>({
  rangeStart: new Date(),
  setRangeStart: (start: Date) => {
    console.debug(`Tried to setRangeStart(${start}) in the ChartConfigContext before initialisation.`)
  },
  rangeEnd: new Date(),
  setRangeEnd: (start: Date) => {
    console.debug(`Tried to setRangeEnd(${start}) in the ChartConfigContext before initialisation.`)
  },
  sleepMetric: SleepMetric.QUALITY,
  setSleepMetric: (metric: SleepMetric) => {
    console.debug(`Tried to setSleepMetric(${metric}) in the ChartConfigContext before initialisation.`)
  },
  chartView: ChartView.SINGLE_METRIC,
  setChartView: (view: ChartView) => {
    console.debug(`Tried to setChartView(${view}) in the ChartConfigContext before initialisation.`)
  },
  activeMetrics: [SleepMetric.QUALITY],
  setActiveMetrics: () => {
    console.debug('Tried to setStackedMetrics() in the ChartConfigContext before initialisation.')
  }
})
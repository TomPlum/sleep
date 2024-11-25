import { useContext } from 'react'
import { ChartConfigContext } from './ChartConfigContext'

export const useChartConfigContext = () => useContext(ChartConfigContext)
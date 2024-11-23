import { RefObject } from 'react'

export interface ChartSize {
  chartRef: RefObject<HTMLDivElement>
  size: {
    width: number
    height: number
  }
}
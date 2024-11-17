import { useEffect, useRef, useState } from 'react'
import { ChartSize } from './types'

export const useChartSize = (): ChartSize => {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (chartRef.current) {
        setSize({
          width: chartRef.current.offsetWidth,
          height: chartRef.current.offsetHeight
        })
      }
    })

    if (chartRef.current) {
      resizeObserver.observe(chartRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return { size, chartRef }
}
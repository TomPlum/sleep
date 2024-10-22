import { useMemo } from 'react'
import { useSleepContext } from 'context'
import { Axes2D, Axes2DProps } from 'modules/graph/hooks/useAxes2D/types'

export const useAxes2D = ({ metric }: Axes2DProps): Axes2D => {
  const { graphData2d: { data }, activeSessions } = useSleepContext()

  const { yDomain, yTicks } = useMemo(() => {
    if (data) {
      const percentages = data.map(datum => {
        return Number((datum[metric]).toFixed(0))
      })

      const smallest = Math.min(...percentages)
      const lowerBound = smallest < 10 ? 0 : smallest - 10

      const biggest = Math.max(...percentages)
      const upperBound = biggest > 100 ? Math.round(biggest + 10) : biggest > 90 ? 100 : biggest + 5

      const closestLower = Math.round(lowerBound / 10) * 10
      const closestUpper = Math.round(upperBound / 10) * 10

      const yTicks = Array.from({
        length: Math.floor(closestUpper / 10) - Math.ceil(closestLower / 10) + 1
      }).reduce((acc: number[], _, i) => {
        return acc.concat(Math.ceil(closestLower / 10) * 10 + i * 10)
      }, [])

      return {
        yDomain: [lowerBound, upperBound],
        yTicks
      }
    }

    return {
      yDomain: [],
      yTicks: []
    }
  }, [data, metric])

  const xTicks = useMemo<number[]>(() => {
    if (data) {
      return data.map(({ date }) => {
        return date.getTime()
      })
    }

    return []
  }, [data])

  const xAxisInterval = useMemo<number>(() => {
    if (activeSessions < 100) {
      return 5
    } else if (activeSessions > 100 && activeSessions < 250) {
      return 10
    } else if (activeSessions > 250 && activeSessions < 1000) {
      return 60
    } else {
      return 100
    }
  }, [activeSessions])

  return {
    xTicks,
    yTicks,
    yDomain,
    xAxisInterval
  }
}
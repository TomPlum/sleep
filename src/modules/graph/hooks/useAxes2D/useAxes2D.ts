import { useMemo } from "react"
import { useSleepContext } from "context"
import { Axes2D } from "modules/graph/hooks/useAxes2D/types.ts"

export const useAxes2D = (): Axes2D => {
  const { graphData2d: { data }, sleepMetric, activeSessions } = useSleepContext()

  const { yDomain, yTicks } = useMemo(() => {
    if (data) {
      const percentages = data.map(datum => {
        return Number((datum[sleepMetric]).toFixed(0))
      })

      const smallest = Math.min(...percentages)
      const lowerBound = smallest < 10 ? 0 : smallest - 10

      const biggest = Math.max(...percentages)
      const upperBound = biggest > 90 ? 100 : biggest + 10

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
  }, [data, sleepMetric])

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
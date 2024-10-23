import { useMemo } from 'react'
import {
  DeltaLinePlotPoint,
  LinearRegressionPlotPoint, LinearRegressionProps,
  LinearRegressionResponse
} from 'data/useLinearRegression/types'
import dayjs from 'dayjs'
import { useSleepContext } from 'context'

export const useLinearRegression = ({ metric }: LinearRegressionProps): LinearRegressionResponse => {
  const { graphData2d } = useSleepContext()

  const data = useMemo(() => {
    return graphData2d.data?.map(session => ({
      x: dayjs(session.date).valueOf(),
      y: session[metric]
    })) ?? []
  }, [graphData2d.data, metric])

  const regressionLineData = useMemo<LinearRegressionPlotPoint[]>(() => {
    const n = data.length

    if (n > 1) {
      // Calculate sums for linear regression formula
      const sumX = data.reduce((acc, point) => acc + point.x, 0)
      const sumY = data.reduce((acc, point) => acc + point.y, 0)
      const sumXY = data.reduce((acc, point) => acc + point.x * point.y, 0)
      const sumX2 = data.reduce((acc, point) => acc + point.x * point.x, 0)

      // Calculate slope (m) and intercept (b)
      const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
      const b = (sumY - m * sumX) / n

      // Get first and last points
      const xMin = data[0].x
      const xMax = data[n - 1].x

      // Calculate corresponding y values
      const yMin = m * xMin + b
      const yMax = m * xMax + b

      return [
        {
          xDate: xMin,
          y: yMin
        },
        {
          xDate: xMax,
          y: yMax
        }
      ]
    }

    return []
  }, [data])

  const minimum = regressionLineData[0]?.y
  const maximum = regressionLineData[regressionLineData.length - 1]?.y
  const regressionDelta= (maximum - minimum).toFixed(1)

  const regressionLineDeltaVertical = useMemo<DeltaLinePlotPoint[]>(() => {
    const yIntercept = regressionLineData[0]?.y
    const xRegressionDeltaLine = regressionLineData[regressionLineData.length - 1]?.xDate

    return [
      {
        y: yIntercept,
        xDate: xRegressionDeltaLine
      },
      {
        y: yIntercept + Number(regressionDelta),
        xDate: xRegressionDeltaLine
      }
    ]
  }, [regressionDelta, regressionLineData])

  const regressionLineDeltaHorizontal = useMemo<DeltaLinePlotPoint[]>(() => {
    const firstSession = regressionLineData[0]
    return [
      {
        y: firstSession?.y,
        xDate: firstSession?.xDate
      },
      {
        y: firstSession?.y,
        xDate: regressionLineData[regressionLineData.length - 1]?.xDate
      }
    ]
  }, [regressionLineData])


  return {
    regressionLineData,
    regressionDelta: (maximum - minimum).toFixed(1),
    regressionDataKey: metric,
    regressionLineDeltaVertical,
    regressionLineDeltaHorizontal
  }
}
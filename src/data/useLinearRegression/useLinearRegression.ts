import { useMemo} from "react";
import {
  LinearRegressionPlotPoint,
  LinearRegressionResponse
} from "data/useLinearRegression/types.ts";
import dayjs from "dayjs";
import {useSleepContext} from "context";

export const useLinearRegression = (): LinearRegressionResponse => {
  const { graphData2d, sleepMetric } = useSleepContext()

  const data = useMemo(() => {
    return graphData2d.data?.map(session => ({
      x: dayjs(session.date).valueOf(),
      y: session[sleepMetric]
    })) ?? []
  }, [graphData2d.data, sleepMetric])

  const regressionLineData = useMemo<LinearRegressionPlotPoint[]>(() => {
    const n = data.length;
    // Calculate sums for linear regression formula
    const sumX = data.reduce((acc, point) => acc + point.x, 0);
    const sumY = data.reduce((acc, point) => acc + point.y, 0);
    const sumXY = data.reduce((acc, point) => acc + point.x * point.y, 0);
    const sumX2 = data.reduce((acc, point) => acc + point.x * point.x, 0);

    // Calculate slope (m) and intercept (b)
    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    // Get first and last points
    const xMin = data[0].x;
    const xMax = data[n - 1].x;

    // Calculate corresponding y values
    const yMin = m * xMin + b;
    const yMax = m * xMax + b;

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
  }, [data])

  const yRegressionDeltaLine = useMemo<number>(() => {
    const firstSession = regressionLineData[0]
    return firstSession.y
  }, [regressionLineData])

  const xRegressionDeltaLine = useMemo<number>(() => {
    return regressionLineData[regressionLineData.length - 1].xDate
  }, [regressionLineData])

  const minimum = regressionLineData[0].y
  const maximum = regressionLineData[regressionLineData.length - 1].y

  return {
    regressionLineData,
    regressionDelta: (maximum - minimum).toFixed(1),
    regressionDataKey: sleepMetric,
    xRegressionDeltaLine,
    yRegressionDeltaLine
  }
}
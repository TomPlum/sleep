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
    const sumX = data.reduce((acc, point) => acc + point.x, 0);
    const sumY = data.reduce((acc, point) => acc + point.y, 0);
    const sumXY = data.reduce((acc, point) => acc + point.x * point.y, 0);
    const sumX2 = data.reduce((acc, point) => acc + point.x * point.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return data.map(point => ({
      _date: dayjs(point.x).format('MMM YY'),
      y: slope * point.x + intercept,
    }))
  }, [data])

  const yRegressionDeltaLine = useMemo<number>(() => {
    const firstSession = regressionLineData[0]
    return firstSession.y
  }, [regressionLineData])

  const xRegressionDeltaLine = useMemo<number>(() => {
    return regressionLineData.length - 1
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
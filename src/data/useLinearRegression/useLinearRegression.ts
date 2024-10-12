import { useMemo} from "react";
import {
  LinearRegressionProps,
  LinearRegressionResponse
} from "data/useLinearRegression/types.ts";
import dayjs from "dayjs";

export const useLinearRegression = ({ data, metric }: LinearRegressionProps): LinearRegressionResponse => {
  const regressionLineData = useMemo(() => {
    const n = data.length;
    const sumX = data.reduce((acc, point) => acc + point.x, 0);
    const sumY = data.reduce((acc, point) => acc + point.y, 0);
    const sumXY = data.reduce((acc, point) => acc + point.x * point.y, 0);
    const sumX2 = data.reduce((acc, point) => acc + point.x * point.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return data.map(point => ({
      _date: dayjs(point.x).format('MMM YY'),
      [metric]: slope * point.x + intercept,
    }))
  }, [data, metric])

  return {
    regressionLineData,
    regressionDataKey: metric
  }
}
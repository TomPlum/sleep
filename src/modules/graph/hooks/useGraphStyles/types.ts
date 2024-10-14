import {SleepMetric} from "modules/controls/MetricConfiguration";

export type GetMetricColour = (metric: SleepMetric) => string

export interface GraphStylesResponse {
  getMetricColour: GetMetricColour
}
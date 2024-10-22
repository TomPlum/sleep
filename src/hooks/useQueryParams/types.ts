import { SleepMetric } from 'modules/controls/MetricConfiguration'

export type QueryParams = Record<string, string>

export interface UpdateQueryParamsArgs {
  route: string
  params: QueryParams
}

export interface SleepQueryParams {
  metric?: SleepMetric
  start?: Date
  end?: Date
  lng?: string
  stacked?: boolean
}

export interface QueryParamsResponse {
  queryParams: SleepQueryParams
  updateQueryParam: (args: UpdateQueryParamsArgs) => void
}
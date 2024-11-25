import { SleepMetric } from 'modules/ChartControls'
import { ChartView } from 'modules/ChartControls/components/ChartViewSelector/types'

export type QueryParams = Record<string, string>

export interface UpdateQueryParamsArgs {
  route: string
  params: QueryParams
}

export interface RemoveQueryParamsArgs {
  route: string
  key: string
}

export interface SleepQueryParams {
  metric?: SleepMetric
  metrics?: SleepMetric[]
  start?: Date
  end?: Date
  lng?: string
  selected?: number
  view?: ChartView
}

export interface QueryParamsResponse {
  queryParams: SleepQueryParams
  updateQueryParam: (args: UpdateQueryParamsArgs) => void
  removeQueryParam: (args: RemoveQueryParamsArgs) => void
}
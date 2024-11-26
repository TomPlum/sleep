import { SleepMetric } from 'modules/ChartControls'
import { ChartView } from 'modules/ChartControls/components/ChartViewSelector/types'

export type QueryParams = Partial<Record<keyof SleepQueryParams, string>>

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
  is3D?: boolean
}

export interface QueryParamsResponse {
  queryParams: SleepQueryParams
  updateQueryParam: (args: UpdateQueryParamsArgs) => void
  removeQueryParam: (args: RemoveQueryParamsArgs) => void
}
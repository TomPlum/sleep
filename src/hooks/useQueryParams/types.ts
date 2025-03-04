import { SleepMetric } from 'modules/ChartControls'
import { ChartView } from 'modules/ChartControls/components/ChartViewSelector/types'

export type QueryParams = Partial<Record<keyof QueryParameters, string>>

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

export interface HighlightsQueryParams {
  /**
   * The index or ID of the active
   * showcase in the highlights page.
   */
  active?: number
}

export type QueryParameters = SleepQueryParams & HighlightsQueryParams

export interface QueryParamsResponse {
  queryParams: QueryParameters
  updateQueryParam: (args: UpdateQueryParamsArgs) => void
  removeQueryParam: (args: RemoveQueryParamsArgs) => void
}
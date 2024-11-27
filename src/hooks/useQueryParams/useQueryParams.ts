import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'
import {
  QueryParamsResponse,
  RemoveQueryParamsArgs,
  SleepQueryParams,
  UpdateQueryParamsArgs
} from 'hooks/useQueryParams/types'
import { SleepMetric } from 'modules/ChartControls'
import { ChartView } from 'modules/ChartControls/components/ChartViewSelector/types'

export const useQueryParams = (): QueryParamsResponse => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const updateQueryParam = useCallback(({ route, params }: UpdateQueryParamsArgs) => {
    const updatedSearchParams = new URLSearchParams(searchParams)

    Object.entries(params).forEach(([key, value]) => {
      updatedSearchParams.set(key, value)
    })

    navigate({
      pathname: route,
      search: updatedSearchParams.toString()
    }, {
      replace: true
    })
  }, [navigate, searchParams])

  const queryParams = useMemo<SleepQueryParams>(() => {
    return {
      metric: searchParams.get('metric') as SleepMetric,
      start: searchParams.has('start') ? new Date(Number(searchParams.get('start'))) : undefined,
      end: searchParams.has('end') ? new Date(Number(searchParams.get('end'))) : undefined,
      lng: searchParams.get('lng') ?? 'en',
      metrics: searchParams.has('metrics') ? searchParams.get('metrics')?.split(',') as SleepMetric[] : undefined,
      selected: searchParams.get('selected') ? Number(searchParams.get('selected')) : undefined,
      view: searchParams.has('view') ? searchParams.get('view') as ChartView : undefined,
      is3D: searchParams.has('is3D') ? searchParams.get('is3D') === 'true' : undefined
    }
  }, [searchParams])

  const removeQueryParam = useCallback(({ route, key }: RemoveQueryParamsArgs) => {
    const updatedSearchParams = new URLSearchParams(searchParams)
    updatedSearchParams.delete(key)

    navigate({
      pathname: route,
      search: updatedSearchParams.toString()
    }, {
      replace: true
    })
  }, [navigate, searchParams])

  return {
    queryParams,
    removeQueryParam,
    updateQueryParam
  }
}
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'
import {
  QueryParamsResponse,
  RemoveQueryParamsArgs,
  SleepQueryParams,
  UpdateQueryParamsArgs
} from 'hooks/useQueryParams/types'
import { SleepMetric } from 'modules/controls/MetricConfiguration'

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
      stacked: searchParams.has('stacked') ? searchParams.get('stacked') === 'true' : undefined,
      metrics: searchParams.has('metrics') ? searchParams.get('metrics')?.split(',') as SleepMetric[] : undefined
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
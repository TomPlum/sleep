import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { GetPillowDataProps } from 'data/usePillowData/types'
import { fetchPillowData } from 'data/usePillowData/fetchPillowData'

export const usePillowData = ({ type }: GetPillowDataProps) => {
  const readFile = useCallback(() => fetchPillowData(type), [type])

  return useQuery({
    queryKey: ['sleepData', type],
    queryFn: readFile
  })
}
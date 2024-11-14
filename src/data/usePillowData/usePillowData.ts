import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { GetPillowDataProps } from 'data/usePillowData/types'
import { readFile } from 'modules/worker/utility'

export const usePillowData = ({ type }: GetPillowDataProps) => {
  const read = useCallback(async () => {
    const response = await readFile(type)
    return response.text()
  }, [type])

  return useQuery({
    queryKey: ['sleepData', type],
    queryFn: read
  })
}
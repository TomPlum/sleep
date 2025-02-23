import { DataLoading } from 'data/DataLoading'
import { useSleepContext } from 'context/SleepContext'

export const HighlightsPage = () => {
  const { isSleepDataLoading } = useSleepContext()
  
  if (isSleepDataLoading) {
    return (
      <DataLoading />
    )
  }

  return (
    <div>

    </div>
  )
}
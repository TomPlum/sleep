import { useMemo } from 'react'
import { SleepSessionStage, SleepStage } from 'data/useSleepData'
import { v4 as uuid } from 'uuid'
import dayjs from 'dayjs'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { SleepStageDataProps, SleepStageDataResponse } from './types'

export const useSleepStageData = ({ stages }: SleepStageDataProps): SleepStageDataResponse => {
  const sortedStages = useMemo(() => {
    return stages.sort((a, b) => {
      return a.timestamp.getTime() - b.timestamp.getTime()
    })
  }, [stages])

  const sleepStageData = useMemo<SleepSessionStage[]>(() => {
    let i = 0
    const repairedStages: SleepSessionStage[] = []

    while(i < sortedStages.length - 1) {
      const currentStage = sortedStages[i]
      const nextStage = sortedStages[i + 1]

      if (currentStage.stage === nextStage.stage) {
        repairedStages.push(sortedStages[i])
        repairedStages.push(sortedStages[i + 1])
      } else {
        // If the next stage instance isn't of the same stage type,
        // Add the first, but create a matching one that is 1 second before
        // the next sleep stage block.
        repairedStages.push(sortedStages[i])
        repairedStages.push({
          id: uuid(),
          stage: currentStage.stage,
          timestamp: dayjs(nextStage.timestamp).subtract(1, 'second').toDate()
        })
      }

      i += 2
    }

    return repairedStages
  }, [sortedStages])

  const stageCounts = useMemo<Record<SleepStage, number>>(() => {
    return sleepStageData
      .map(datum => datum.stage)
      .reduce<Record<SleepStage, number>>((counts, stage) => {
        const count = counts[stage]
        counts[stage] = (count ?? 0) + 1
        return counts
      }, {
        [SleepMetric.AWAKE_TIME]: 0,
        [SleepMetric.DEEP_SLEEP]: 0,
        [SleepMetric.LIGHT_SLEEP]: 0,
        [SleepMetric.REM_SLEEP]: 0
      })
  }, [sleepStageData])

  const presentStages = useMemo(() => {
    return Object.entries(stageCounts).filter(([,count]) => {
      return count > 0
    })
  }, [stageCounts])

  return {
    sleepStageData,
    stageCounts,
    presentStages
  }
}
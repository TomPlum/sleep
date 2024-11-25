import { useMemo } from 'react'
import { SleepSessionStage, SleepStage } from 'data/useSleepData'
import { v4 as uuid } from 'uuid'
import dayjs from 'dayjs'
import { SleepMetric } from 'modules/ChartControls'
import { SleepStageDataProps, SleepStageDataResponse, SleepStageTransitionLineData } from './types'

export const useSleepStageData = ({ stages }: SleepStageDataProps): SleepStageDataResponse => {
  const sortedStages = useMemo(() => {
    const ids = new Set<string>()

    const uniqueById = stages.filter(stage => {
      if (ids.has(stage.id)) {
        return false
      }
      ids.add(stage.id)
      return true
    })

    return uniqueById.sort((a, b) => {
      return a.timestamp.getTime() - b.timestamp.getTime()
    })
  }, [stages])

  const sleepStageData = useMemo<SleepSessionStage[]>(() => {
    let i = 0

    // Some sleep stage records seem to be missing the ends
    // of some of the instances. We're detecting any missing
    // ones here and figuring it out by looking ahead at the
    // start of the next stage and subtracting 1 second.
    const repairedStages: SleepSessionStage[] = []

    while(i < sortedStages.length - 1) {
      const currentStage = sortedStages[i]
      const nextStage = sortedStages[i + 1]

      if (currentStage.stage === nextStage.stage) {
        // If the stage matches then we have a valid pair, send it
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

      // The stages instance, once sorted chronologically, should
      // be in pairs (the start and end of a given sleep stage).
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

  const stageTransitions = useMemo<SleepStageTransitionLineData>(() => {
    // Start at the end of the first sleep stage block
    let i = 1
    const startPoints = []

    while(i < sleepStageData.length - 1) {
      const left = sleepStageData[i]
      const right = sleepStageData[i + 1]

      startPoints.push({
        time: left.timestamp.getTime(),
        stage: left.stage,
        nextStage: right.stage
      })

      // Skip to the start of the next sleep stage block
      i += 2
    }

    return startPoints
  }, [sleepStageData])

  return {
    sleepStageData,
    stageCounts,
    presentStages,
    stageTransitions
  }
}
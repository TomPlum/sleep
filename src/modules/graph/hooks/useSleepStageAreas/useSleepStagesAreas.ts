import { useMemo } from 'react'
import _ from 'lodash'
import { SleepSessionStage } from 'data/useSleepData'
import { generateTicks } from 'modules/graph/utils/generateTicks'
import { getSleepStageYValue } from 'modules/graph/utils/getSleepStageYValue'
import { Y_DOMAIN_OFFSET } from 'modules/graph/components/SleepSessionStageBreakdownGraph/types'
import {
  GetSleepStageAreaDataProps, SleepStageAreaInstance, SleepStageAreaInstanceData
} from 'modules/graph/hooks/useSleepStageAreas/types'
import { getMetricColour } from 'modules/graph/hooks/useGraphStyles'
import dayjs from 'dayjs'

export const useSleepStagesAreas = ({ sleepStageData }: GetSleepStageAreaDataProps) => {
  const sleepStageAreaData = useMemo<SleepStageAreaInstance[]>(() => {
    return _.range(0, sleepStageData.length - 2 + 1, 1)
      .map((i: number) => sleepStageData.slice(i, i + 2))
      .map(([left, right]: SleepSessionStage[]) => {
        const horizontalEdge = generateTicks({
          start: left.timestamp,
          end: right.timestamp,
          unit: 'minute',
          interval: 1
        })

        const horizontalEdgeInnerPoints = horizontalEdge.slice(0, horizontalEdge.length - 2)
        const yTopValue = getSleepStageYValue(left.stage) + Y_DOMAIN_OFFSET
        const yBottomValue = getSleepStageYValue(left.stage) - Y_DOMAIN_OFFSET
        const duration = dayjs(right.timestamp).diff(dayjs(left.timestamp), 'milliseconds')

        const topEdge = horizontalEdgeInnerPoints.map((xTime) => ({
          time: xTime.getTime(),
          y: yTopValue,
          duration
        }))

        const bottomEdge = horizontalEdgeInnerPoints.map((xTime) => ({
          time: xTime.getTime(),
          y: yBottomValue,
          duration
        }))

        const id = `sleep-stage-instance-${left.stage}-${left.timestamp.getTime()}-${right.timestamp.getTime()}`

        const data: SleepStageAreaInstanceData = [
          // Top left corner
          { time: left.timestamp.getTime(), y: yTopValue, duration  },

          // Top edge points
          ...topEdge,

          // Top right corner
          { time: right.timestamp.getTime(), y: yTopValue, duration },

          // Bottom right corner
          { time: right.timestamp.getTime(), y: yBottomValue, duration },

          // Bottom edge points
          ...bottomEdge,

          // Bottom left corner
          { time: left.timestamp.getTime(), y: yBottomValue, duration }
        ]

        return {
          id,
          data,
          fill: getMetricColour(left.stage)
        }
      })
  }, [sleepStageData])

  return {
    sleepStageAreaData
  }
}
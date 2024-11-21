import {
  CartesianGrid, ComposedChart,
  Legend,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import {
  SleepSessionStageBreakdownGraphProps,
  SleepStageGraphData,
  SleepStageGraphDatum, SleepStageTransitionLineData
} from 'modules/graph/components/SleepSessionStageBreakdownGraph/types'
import { useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import { SleepSessionStage, SleepStage } from 'data/useSleepData'
import styles from './SleepSessionStageBreakdownGraph.module.scss'
import { getMetricColour } from 'modules/graph/hooks/useGraphStyles'
import { LegendItem } from 'modules/graph/components/LegendItem'
import { SleepStageTooltip } from 'modules/graph/components/SleepStageTooltip'
import { v4 as uuid } from 'uuid'

const yDomainOffset = 0.3

export const SleepSessionStageBreakdownGraph = ({ stages, sounds }: SleepSessionStageBreakdownGraphProps) => {
  const sortedStages = useMemo(() => {
    return stages.sort((a, b) => {
      return a.timestamp.getTime() - b.timestamp.getTime()
    })
  }, [stages])

  const repairedStages = useMemo<SleepSessionStage[]>(() => {
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

  const getYValue = useCallback((stage: SleepStage) => {
    switch (stage) {
      case SleepMetric.AWAKE_TIME: {
        return 3
      }
      case SleepMetric.REM_SLEEP: {
        return 2
      }
      case SleepMetric.LIGHT_SLEEP: {
        return 1
      }
      case SleepMetric.DEEP_SLEEP: {
        return 0
      }
    }
  }, [])

  const stageTransitions = useMemo<SleepStageTransitionLineData>(() => {
    // Start at the end of the first sleep stage block
    let i = 1
    const startPoints = []

    while(i < repairedStages.length - 1) {
      const left = repairedStages[i]
      const right = repairedStages[i + 1]

      startPoints.push({
        time: left.timestamp.getTime(),
        stage: left.stage,
        nextStage: right.stage
      })

      // Skip to the start of the next sleep stage block
      i += 2
    }

    return startPoints
  }, [repairedStages])
  console.log('stageTransitions', stageTransitions)
  console.log('repairedStages', repairedStages)

  const chartData = useMemo<SleepStageGraphData>(() => {
    let i = 0
    const stageInstances: SleepStageGraphDatum[] = []

    while(i < repairedStages.length - 1) {
      const left = repairedStages[i]
      const right = repairedStages[i + 1]

      stageInstances.push({
        startTime: left.timestamp.getTime(),
        endTime: right.timestamp.getTime(),
        stage: left.stage
      })

      // Skip to the start of the next sleep stage block
      i += 2
    }

    return stageInstances
  }, [repairedStages])

  const xDomain = useMemo(() => {
    const min = Math.min(...chartData.map(({ startTime }) => startTime))
    const max = Math.max(...chartData.map(({ endTime }) => endTime))
    return [min, max]
  }, [chartData])

  const xTicks = useMemo(() => {
    const [start, end] = xDomain

    const startTime = dayjs(start).startOf('hour')
    const endTime = dayjs(end).startOf('hour')

    const hours: number[] = []
    let current = startTime

    while (current.isBefore(endTime) || current.isSame(endTime)) {
      hours.push(current.toDate().getTime())
      current = current.add(1, 'hour')
    }

    return hours
  }, [xDomain])

  const { yDomain, yTicks } = useMemo<{ yDomain: Array<SleepStage>, yTicks: number[] }>(() => {
    const stageCounts = chartData
      .map(datum => datum.stage)
      .reduce<Record<SleepStage, number>>((acc, stage) => {
        const count = acc[stage]
        acc[stage] = (count ?? 0) + 1
        return acc
      }, {
        [SleepMetric.AWAKE_TIME]: 0,
        [SleepMetric.DEEP_SLEEP]: 0,
        [SleepMetric.LIGHT_SLEEP]: 0,
        [SleepMetric.REM_SLEEP]: 0
      })

    const domain: Array<SleepStage> = []
    const ticks: number[] = []

    if (stageCounts[SleepMetric.DEEP_SLEEP] > 0) {
      domain.push(SleepMetric.DEEP_SLEEP)
      ticks.push(getYValue(SleepMetric.DEEP_SLEEP))
      ticks.push(getYValue(SleepMetric.DEEP_SLEEP) - yDomainOffset)
    }

    if (stageCounts[SleepMetric.LIGHT_SLEEP] > 0) {
      domain.push(SleepMetric.LIGHT_SLEEP)
      ticks.push(getYValue(SleepMetric.LIGHT_SLEEP))
      ticks.push(getYValue(SleepMetric.LIGHT_SLEEP) - yDomainOffset)
    }

    if (stageCounts[SleepMetric.REM_SLEEP] > 0) {
      domain.push(SleepMetric.REM_SLEEP)
      ticks.push(getYValue(SleepMetric.REM_SLEEP))
      ticks.push(getYValue(SleepMetric.REM_SLEEP) - yDomainOffset)
    }

    if (stageCounts[SleepMetric.AWAKE_TIME] > 0) {
      domain.push(SleepMetric.AWAKE_TIME)
      ticks.push(getYValue(SleepMetric.AWAKE_TIME))
      ticks.push(getYValue(SleepMetric.AWAKE_TIME) - yDomainOffset)
    }

    return {
      yDomain: domain,
      yTicks: ticks
    }
  }, [chartData, getYValue])
  console.log('yDomain', yDomain)
  console.log('yTicks', yTicks)
  console.log('xTicks', xTicks)

  return (
   <ResponsiveContainer width='100%' height='100%'>
     <ComposedChart data={chartData}>
       <XAxis
         type='number'
         ticks={xTicks}
         dataKey='time'
         domain={xDomain}
         stroke='rgb(255, 255, 255)'
         tickFormatter={(value: number) => {
           return `${dayjs(value).format('HH')}:00`
         }}
       />

       <YAxis
         hide
         dataKey='y'
         type='number'
         ticks={yTicks}
         domain={yDomain}
         padding={{ bottom: 30, top: 30 }}
       />

       <CartesianGrid
         vertical={false}
         strokeDasharray="3 10"
         stroke='rgba(255, 255, 255, 0.4)'
       />

       {chartData.map(({ stage, startTime, endTime }) => (
         <ReferenceArea
           x1={startTime}
           y1={getYValue(stage) - yDomainOffset}
           x2={endTime}
           y2={getYValue(stage) + yDomainOffset}
           type='monotone'
           fillOpacity={1}
           fill={getMetricColour(stage)}
           shape={({ x, y, width, height, fill }) => {
             // TODO: Customise corner radii
             const topLeftRadius = 1
             const topRightRadius = 1
             const bottomRightRadius = 1
             const bottomLeftRadius = 1

             return (
               <path
                 d={`
                  M ${x + topLeftRadius},${y} 
                  H ${x + width - topRightRadius} 
                  Q ${x + width},${y} ${x + width},${y + topRightRadius} 
                  V ${y + height - bottomRightRadius} 
                  Q ${x + width},${y + height} ${x + width - bottomRightRadius},${y + height} 
                  H ${x + bottomLeftRadius} 
                  Q ${x},${y + height} ${x},${y + height - bottomLeftRadius} 
                  V ${y + topLeftRadius} 
                  Q ${x},${y} ${x + topLeftRadius},${y} 
                  Z
                `}
                 fill={fill}
               />
             )
           }}
         />
       ))}

       {sounds.map(sound => (
         <ReferenceLine
           key={sound.id}
           x={sound.timestamp.getTime()}
           className={styles.soundLine}
           id={`sound_instance_${sound.id}`}
         />
       ))}

       <defs>
         {stageTransitions.map(({ stage, nextStage, time }) => {
           const y0 = getYValue(stage)
           const y1 = getYValue(nextStage)
           const isNextStageBelow = y1 < y0
           const onValue = 1
           const gradientY1 = isNextStageBelow ? 0 : onValue
           const gradientY2 = isNextStageBelow ? onValue : 0

           return (
             <linearGradient key={time + stage} id={time.toString()} x1={0} y1={gradientY1} x2={0} y2={gradientY2}>
               <stop key={time + stage} stopColor={getMetricColour(stage)} offset={'0%'} />
               <stop key={time + nextStage} stopColor={getMetricColour(nextStage)} offset={'100%'} />
             </linearGradient>
           )
         })}
       </defs>

       {stageTransitions.map(({ stage, nextStage, time }) => {
         const y0 = getYValue(stage)
         const y1 = getYValue(nextStage)
         const isNextStageBelow = y1 < y0

         return (
           <Line
             type='monotone'
             key={`stage-start-${time}`}
             dataKey='y'
             data={[
               { y: y0 + (isNextStageBelow ? yDomainOffset : -yDomainOffset), time },
               { y: y1 + (isNextStageBelow ? -yDomainOffset : yDomainOffset), time },
               // https://stackoverflow.com/a/21639059
               // We need a third point off-center so the line is no longer straight
               { y: y1, time: time + 100 }
             ]}
             stroke={`url(#${time.toString()})`}
             id={`stage-start-${time}`}
             strokeWidth={3}
             dot={false}
           />
         )
       })}

       <Tooltip
         content={SleepStageTooltip}
       />

       <Legend
         height={30}
         verticalAlign='top'
         formatter={LegendItem}
         id='sleep-stage-breakdown-legend'
         payload={yDomain.map(stage => ({
           id: stage,
           value: stage,
           type: 'diamond',
           color: getMetricColour(stage)
         }))}
       />
     </ComposedChart>
   </ResponsiveContainer>
  )
}
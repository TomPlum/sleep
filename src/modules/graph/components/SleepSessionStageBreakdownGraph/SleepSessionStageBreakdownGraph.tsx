import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
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
  SleepStageGraphDatum,
  SleepStageTransitionLineData, Y_DOMAIN_OFFSET
} from 'modules/graph/components/SleepSessionStageBreakdownGraph/types'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import { SleepStage } from 'data/useSleepData'
import styles from './SleepSessionStageBreakdownGraph.module.scss'
import { getMetricColour } from 'modules/graph/hooks/useGraphStyles'
import { LegendItem } from 'modules/graph/components/LegendItem'
import { SleepStageTooltip } from 'modules/graph/components/SleepStageTooltip'
import { useSleepStageData } from 'data/useSleepStageData'
import { generateTicks } from 'modules/graph/utils/generateTicks'
import { getSleepStageYValue } from 'modules/graph/utils/getSleepStageYValue'
import { useSleepStagesAreas } from 'modules/graph/hooks/useSleepStageAreas'


export const SleepSessionStageBreakdownGraph = ({ stages, sounds }: SleepSessionStageBreakdownGraphProps) => {
  const { sleepStageData, presentStages } = useSleepStageData({ stages })
  const { sleepStageAreaData } = useSleepStagesAreas({ sleepStageData })

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

  const chartData = useMemo<SleepStageGraphData>(() => {
    let i = 0
    const stageInstances: SleepStageGraphDatum[] = []

    while(i < sleepStageData.length - 1) {
      const left = sleepStageData[i]
      const right = sleepStageData[i + 1]

      stageInstances.push({
        startTime: left.timestamp.getTime(),
        endTime: right.timestamp.getTime(),
        stage: left.stage
      })

      // Skip to the start of the next sleep stage block
      i += 2
    }

    return stageInstances
  }, [sleepStageData])

  const xDomain = useMemo(() => {
    const min = Math.min(...chartData.map(({ startTime }) => startTime))
    const max = Math.max(...chartData.map(({ endTime }) => endTime))
    return [min, max]
  }, [chartData])

  const xTicks = useMemo(() => {
    const [start, end] = xDomain

    return generateTicks({
      start: dayjs(start).startOf('hour').toDate(),
      end: dayjs(end).startOf('hour').toDate(),
      interval: 1,
      unit: 'hours'
    }).map((date) => {
      return date.getTime()
    })
  }, [xDomain])

  const { yDomain, yTicks } = useMemo<{ yDomain: number[], yTicks: number[] }>(() => {
    const presentStageYValues = presentStages.map(([stage]) => {
      return getSleepStageYValue(stage as SleepStage)
    })

    const domainUpperBound = Math.max(...presentStageYValues)
    const domainLowerBound = Math.min(...presentStageYValues)

    return {
      yDomain: [domainLowerBound, domainUpperBound],
      yTicks: presentStageYValues.sort()
    }
  }, [presentStages])

  return (
   <ResponsiveContainer width='100%' height='100%'>
     <ComposedChart>
       <XAxis
         type='number'
         ticks={xTicks}
         dataKey='time'
         domain={xDomain}
         stroke='rgb(255, 255, 255)'
         tickFormatter={(value: number) => {
           return `${dayjs(value).format('HH:mm')}`
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

       {sleepStageAreaData.map(({ id, data, fill }) => {
         return (
           <Area
             id={id}
             key={id}
             dataKey='y'
             fill={fill}
             data={data}
             stroke='none'
             fillOpacity={1}
             type='linearClosed'
           />
         )
         })
       }

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
           const y0 = getSleepStageYValue(stage)
           const y1 = getSleepStageYValue(nextStage)
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
         const y0 = getSleepStageYValue(stage)
         const y1 = getSleepStageYValue(nextStage)
         const isNextStageBelow = y1 < y0

         return (
           <Line
             type='monotone'
             key={`stage-start-${time}`}
             dataKey='y'
             data={[
               { y: y0 + (isNextStageBelow ? Y_DOMAIN_OFFSET : -Y_DOMAIN_OFFSET), time },
               { y: y1 + (isNextStageBelow ? -Y_DOMAIN_OFFSET : Y_DOMAIN_OFFSET), time },
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
         payload={presentStages.map(([stage]) => ({
           id: stage,
           value: stage,
           type: 'diamond',
           color: getMetricColour(stage as SleepMetric)
         }))}
       />
     </ComposedChart>
   </ResponsiveContainer>
  )
}
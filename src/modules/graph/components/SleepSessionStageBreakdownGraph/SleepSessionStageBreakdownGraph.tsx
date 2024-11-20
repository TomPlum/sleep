import {
  CartesianGrid, ComposedChart,
  Legend, Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import {
  SleepSessionStageBreakdownGraphProps,
  SleepStageGraphData
} from 'modules/graph/components/SleepSessionStageBreakdownGraph/types'
import { useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import { SleepStage } from 'data/useSleepData'
import { SleepStageBar } from 'modules/graph/components/SleepStageBar'
import styles from './SleepSessionStageBreakdownGraph.module.scss'
import { useChartSize } from 'modules/graph/hooks/useChartSize'
import { getMetricColour } from 'modules/graph/hooks/useGraphStyles'
import { LegendItem } from 'modules/graph/components/LegendItem'
import { SleepStageTooltip } from 'modules/graph/components/SleepStageTooltip'

export const SleepSessionStageBreakdownGraph = ({ stages, sounds }: SleepSessionStageBreakdownGraphProps) => {
  const { size, chartRef } = useChartSize()

  const sortedStages = useMemo(() => {
    return stages.sort((a, b) => {
      return a.timestamp.getTime() - b.timestamp.getTime()
    })
  }, [stages])

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

  const stageStartPoints = useMemo(() => {
    // Start at the end of the first sleep stage block
    let i = 1
    const startPoints = []

    while(i < sortedStages.length - 1) {
      const left = sortedStages[i]
      const right = sortedStages[i + 1]

      startPoints.push({
        time: dayjs(left.timestamp).subtract(30, 'seconds').toDate().getTime(),
        stage: left.stage,
        nextStage: right.stage
      })

      // Skip to the start of the next sleep stage block
      i += 2
    }

    return startPoints
  }, [sortedStages])
  console.log('stageStartPoints', stageStartPoints)
  console.log('sortedStages', sortedStages)

  const chartData = useMemo<SleepStageGraphData>(() => {
    const windowSize = 2
    return sortedStages.slice(0, sortedStages.length - windowSize + 1)
      .map((_, i) => sortedStages.slice(i, i + windowSize))
      .flatMap(([first, second]) => {
        const startTime = dayjs(first.timestamp).startOf('minute')
        const endTime = dayjs(second.timestamp).startOf('minute').subtract(1, 'minute')

        const minutes: number[] = []
        let current = startTime

        while (current.isBefore(endTime) || current.isSame(endTime)) {
          minutes.push(current.toDate().getTime())
          current = current.add(1, 'minute')
        }

        return minutes.map(minute => ({
          time: minute,
          stage: first.stage,
          y: getYValue(first.stage)
        }))
      })
  }, [sortedStages, getYValue])

  const xDomain = useMemo(() => {
    const min = Math.min(...chartData.map(({ time }) => time))
    const max = Math.max(...chartData.map(({ time }) => time))
    console.log('min', dayjs(min).format('YYYY-MM-DD HH:mm:ss'))
    console.log('max', dayjs(max).format('YYYY-MM-DD HH:mm:ss'))
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
  console.log('xDomain', xDomain)

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
    }

    if (stageCounts[SleepMetric.LIGHT_SLEEP] > 0) {
      domain.push(SleepMetric.LIGHT_SLEEP)
      ticks.push(getYValue(SleepMetric.LIGHT_SLEEP))
    }

    if (stageCounts[SleepMetric.REM_SLEEP] > 0) {
      domain.push(SleepMetric.REM_SLEEP)
      ticks.push(getYValue(SleepMetric.REM_SLEEP))
    }

    if (stageCounts[SleepMetric.AWAKE_TIME] > 0) {
      domain.push(SleepMetric.AWAKE_TIME)
      ticks.push(getYValue(SleepMetric.AWAKE_TIME))
    }

    return {
      yDomain: domain,
      yTicks: ticks
    }
  }, [chartData, getYValue])

  return (
   <ResponsiveContainer width='100%' height='100%' ref={chartRef}>
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
         padding={{ bottom: 50, top: 50 }}
       />

       <CartesianGrid
         vertical={false}
         strokeDasharray="3 10"
         stroke='rgba(255, 255, 255, 0.4)'
       />

       <Scatter
         // @ts-expect-error I think Recharts has bad typing here
         shape={props => (
           <SleepStageBar
             {...props}
             chartHeight={size.height}
             uniqueMetrics={yDomain.length}
           />
         )}
       />

       {
         sounds.map(sound => (
           <ReferenceLine
             key={sound.id}
             x={sound.timestamp.getTime()}
             className={styles.soundLine}
             id={`sound_instance_${sound.id}`}
           />
         ))
       }

       <defs>
         {
           stageStartPoints.map(({ stage, nextStage, time }) => {
             const y0 = getYValue(stage)
             const y1 = getYValue(nextStage)
             const isNextStageBelow = y1 < y0
             const onValue = 1
             const gradientY1 = isNextStageBelow ? 0 : onValue
             const gradientY2 = isNextStageBelow ? onValue : 0

             return (
               <linearGradient key={time + stage} id={time.toString()} x1={0} y1={gradientY1} x2={0} y2={gradientY2} /*gradientUnits="userSpaceOnUse"*/>
                 <stop key={time + stage} stopColor={getMetricColour(stage)} offset={'0%'} />
                 <stop key={time + nextStage} stopColor={getMetricColour(nextStage)} offset={'100%'} />
               </linearGradient>
             )
           })
         }
       </defs>

       {
         stageStartPoints.map(({ stage, nextStage, time }) => {
           const y0 = getYValue(stage)
           const y1 = getYValue(nextStage)
           
           return (
             <Line
               type='monotone'
               key={`stage-start-${time}`}
               dataKey='y'
               data={[
                 { y: y0, time },
                 { y: y1, time },
                 // https://stackoverflow.com/a/21639059 - We need a third point off-center so the line is no longer straight
                 { y: y1, time: time + 100 }
               ]}
               stroke={`url(#${time.toString()})`}
               id={`stage-start-${time}`}
               strokeWidth={4}
               dot={false}
             />
           )
         })
       }

       <Tooltip
         filterNull
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
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { SleepSessionStageBreakdownGraphProps } from 'modules/graph/components/SleepSessionStageBreakdownGraph/types'
import { useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import { SleepStage } from 'data/useSleepData'
import { SleepStageBar } from 'modules/graph/components/SleepStageBar'

export const SleepSessionStageBreakdownGraph = ({ data }: SleepSessionStageBreakdownGraphProps) => {

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

  const barData = useMemo(() => {
    const sorted = data.sort((a, b) => {
      return a.timestamp.getTime() - b.timestamp.getTime()
    })

    const windowSize = 2
    return sorted.slice(0, sorted.length - windowSize + 1)
      .map((_, i) => sorted.slice(i, i + windowSize))
      .map((window) => {
        const first = window[0]
        const second = window[1]

        return {
          start: first.timestamp,
          end: second.timestamp,
          stage: first.stage,
          y: getYValue(first.stage)
        }
      })
  }, [data, getYValue])

  const xDomain = useMemo(() => {
    const min = Math.min(...barData.map(({ start }) => start.getTime()))
    const max = Math.max(...barData.map(({ end }) => end.getTime()))
    return [min, max]
  }, [barData])

  const xTicks = useMemo(() => {
    const [min, max] = xDomain

    const hours: number[] = []
    let current = dayjs(min)

    while (current.isBefore(dayjs(max)) || current.isSame(dayjs(max))) {
      hours.push(current.toDate().getTime())
      current = current.add(1, 'hour')
    }

    // TODO: Check this. We may need to add min/max only in certain cases
    hours.unshift(min)

    return hours
  }, [xDomain])

  const { yDomain, yTicks } = useMemo<{ yDomain: Array<SleepStage>, yTicks: number[] }>(() => {
    const stageCounts = barData
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
  }, [barData, getYValue])

  return (
   <ResponsiveContainer width='100%' height='100%'>
     <ScatterChart data={barData}>
       <XAxis
         type='number'
         ticks={xTicks}
         dataKey='start'
         domain={xDomain}
         stroke='rgb(255, 255, 255)'
         tickFormatter={(value: string) => {
           return `${dayjs(value).format('HH')}:00`
         }}
       />

       <YAxis
         hide
         dataKey='y'
         type='number'
         ticks={yTicks}
         domain={yDomain}
         padding={{ bottom: 70, top: 70 }}
       />

       <CartesianGrid
         vertical={false}
         strokeDasharray="3 10"
         stroke='rgba(255, 255, 255, 0.4)'
       />

       <Scatter
         shape={(props) => <SleepStageBar {...props} />}
       />
     </ScatterChart>
   </ResponsiveContainer>
  )
}
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { SleepSessionStageBreakdownGraphProps } from 'modules/graph/components/SleepSessionStageBreakdownGraph/types'
import { useCallback, useMemo } from 'react'
import { getMetricColour } from 'modules/graph/hooks/useGraphStyles'
import dayjs from 'dayjs'
import { SleepStage } from 'data/useSleepData'

const CustomBar = (props: any) => {
  const { cx, cy, payload, xAxis } = props
  const barWidth = xAxis.scale(payload.end.valueOf()) - xAxis.scale(payload.start.valueOf())
  const barHeight = 75

  return (
    <g>
      <rect
        x={cx}
        rx={4}
        ry={4}
        width={barWidth}
        height={barHeight}
        y={cy - barHeight / 2}
        fill={getMetricColour(payload.stage)}
      />
    </g>
  )
}

export const SleepSessionStageBreakdownGraph = ({ data }: SleepSessionStageBreakdownGraphProps) => {
  console.log('Raw breakdown data', data)

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

  console.log('barData', barData)

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

    // hours.unshift(dayjs(hours[0]).subtract(1, 'hour').toDate().getTime())

    return hours
  }, [xDomain])

  const yDomain = useMemo(() => [
    getYValue(SleepMetric.AWAKE_TIME),
    getYValue(SleepMetric.REM_SLEEP),
    getYValue(SleepMetric.LIGHT_SLEEP),
    getYValue(SleepMetric.DEEP_SLEEP)
  ], [getYValue])

  return (
   <ResponsiveContainer width='100%' height={400}>
     <ScatterChart data={barData}>
       <XAxis
         type='number'
         dataKey='start'
         domain={xDomain}
         ticks={xTicks}
         tickFormatter={(value: string) => {
           return `${dayjs(value).format('HH')}:00`
         }}
       />

       <YAxis
         hide
         dataKey='y'
         type='number'
         domain={yDomain}
         ticks={[0, 1, 2, 3]}
         padding={{ bottom: 70, top: 70 }}
       />

       <CartesianGrid
         vertical={false}
         strokeDasharray={'5 10'}
       />

       <Scatter
         shape={<CustomBar />}
       />
     </ScatterChart>
   </ResponsiveContainer>
  )
}
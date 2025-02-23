import { useSleepContext } from 'context/SleepContext'
import { useMemo } from 'react'
import { SleepMetricLineChartDatum } from 'modules/MetricLineChart'
import { SleepMetric } from 'modules/ChartControls'
import { HighligthedSessions } from './types'

export const useHighlightedSessions = (): HighligthedSessions => {
  const { graphData2d: { data, latestSession } } = useSleepContext()

  const bestSession = useMemo<SleepMetricLineChartDatum>(() => {
    return data.reduce<SleepMetricLineChartDatum>((bestSessionSoFar, session) => {
      if (session[SleepMetric.QUALITY] > bestSessionSoFar[SleepMetric.QUALITY]) {
        return session
      }

      return bestSessionSoFar
    }, data[0])
  }, [data])

  const worstSession = useMemo<SleepMetricLineChartDatum>(() => {
    return data.reduce<SleepMetricLineChartDatum>((worstSessionSoFar, session) => {
      if (session[SleepMetric.QUALITY] < worstSessionSoFar[SleepMetric.QUALITY]) {
        return session
      }

      return worstSessionSoFar
    }, data[0])
  }, [data])

  const mostRecentSession = useMemo<SleepMetricLineChartDatum | undefined>(() => {
    return data.find(session => session.date.getTime() === latestSession.getTime())
  }, [data, latestSession])

  return {
    bestSession,
    worstSession,
    mostRecentSession
  }
}
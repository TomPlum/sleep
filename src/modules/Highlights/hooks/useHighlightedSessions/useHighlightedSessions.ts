import { useSleepContext } from 'context/SleepContext'
import { useMemo } from 'react'
import { HighlightedSessions } from './types'
import { PillowSleepSession } from 'data/useSleepData'

export const useHighlightedSessions = (): HighlightedSessions => {
  const { sleepData } = useSleepContext()

  const { sessions, latestSession } = useMemo(() => {
    return {
      sessions: sleepData?.sessions ?? [],
      latestSession: sleepData?.latestSession
    }
  }, [sleepData])

  const bestSession = useMemo<PillowSleepSession>(() => {
    return sessions.reduce<PillowSleepSession>((bestSessionSoFar, session) => {
      if (session.sleepQuality > bestSessionSoFar.sleepQuality) {
        return session
      }

      return bestSessionSoFar
    }, sessions[0])
  }, [sessions])

  const worstSession = useMemo<PillowSleepSession>(() => {
    return sessions.reduce<PillowSleepSession>((worstSessionSoFar, session) => {
      if (session.sleepQuality < worstSessionSoFar.sleepQuality) {
        return session
      }

      return worstSessionSoFar
    }, sessions[0])
  }, [sessions])

  const mostRecentSession = useMemo<PillowSleepSession | undefined>(() => {
    return sessions.find(session => session.endTime.getTime() === latestSession?.getTime())
  }, [sessions, latestSession])

  return {
    bestSession,
    worstSession,
    mostRecentSession
  }
}
import { PillowSleepSession } from 'data/useSleepData'

export interface HighlightedSessions {
  bestSession: PillowSleepSession
  worstSession: PillowSleepSession
  mostRecentSession?: PillowSleepSession
}
export interface PillowSessionDuration {
  /**
   * The total number of minutes spend
   * in bed that were recorded.
   */
  total: number

  /**
   * The number of minutes that I was
   * deemed to be awake by Pillow
   * during the session.
   */
  awake: number

  /**
   * The number of minutes that I was
   * deemed to be in light-sleep by
   * Pillow during the session.
   */
  light: number

  /**
   * The number of minutes that I was
   * deemed to be in deep-sleep by
   * Pillow during the session.
   */
  deep: number

  /**
   * The number of minutes that I was
   * deemed to be in REM (Rapid Eye Movement)
   * sleep by Pillow during the session.
   */
  rem: number
}

export interface PillowSleepSession {
  /**
   * A unique identifier for the
   * sleep session.
   */
  id: string

  /**
   * The time the sleep session was
   * started either manually or when
   * it was recorded in automatic mode.
   */
  startTime: Date

  /**
   * The time the sleep session was
   * ended either manually or when
   * it was recorded in automatic mode.
   */
  endTime: Date

  /**
   * A breakdown of the time spent
   * in bed during the session.
   */
  duration: PillowSessionDuration

  /**
   * Whether the session was a nap
   * or not.
   */
  isNap: boolean

  /**
   * The quality of sleep as determined
   * by Pillows algorithms. Is a percentage
   * between 0 and 100%.
   */
  sleepQuality: number

  /**
   * The number of times audio was
   * recorded during the session.
   */
  audioRecordings: number

  /**
   * The wakeup mood as recorded by
   * myself after waking up. This
   * is optionally added some days.
   */
  mood?: string
}

export interface PillowSleepData {
  /**
   * A list of all session data
   * exported from my iPhone.
   */
  sessions: PillowSleepSession[]

  /**
   * The date of the earliest sleep
   * session recorded.
   */
  earliestSession: Date

  /**
   * The date of the most recent sleep
   * session recorded.
   */
  latestSession: Date
}

export interface SleepDataResponse {
  sleepData?: PillowSleepData
  loading: boolean
  error: Error | null
}
import { IsValidSessionProps } from './types'

export const isValidSession = ({ duration, isNap }: IsValidSessionProps) => {
  const hasValidDuration = duration.total > 0 && duration.total < (60 * 15)
  const hasInvalidBreakdown = [duration.light, duration.deep, duration.rem, duration.awake].every(v => v <= 0)
  const isAllAwakeTime = [duration.light, duration.deep, duration.rem].every(v => v === 0) && duration.awake > 0
  const hasValidAwakeTime = duration.awake <= duration.total
  const isTooShort = !isNap && duration.total < 90

  return hasValidDuration && !hasInvalidBreakdown && hasValidAwakeTime && !isTooShort && !isAllAwakeTime
}
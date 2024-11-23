export interface FormatTimeElapsedProps {
  /**
   * The time in milliseconds
   */
  time: number

  /**
   * Whether to include milliseconds
   * in the format. Defaults to true.
   */
  showMs?: boolean
}

/**
 * Converts milliseconds into a prettier, human-readable
 * format to be rendered on the UI.
 */
export const formatTimeElapsed = ({ time, showMs = true }: FormatTimeElapsedProps) => {
  const milliseconds = time % 1000
  const seconds = Math.floor((time / 1000) % 60)
  const minutes = Math.floor((time / (1000 * 60)) % 60)
  const hours = Math.floor(time / (1000 * 60 * 60))

  const parts = []

  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0) parts.push(`${seconds}s`)
  if (milliseconds > 0 && showMs) parts.push(`${milliseconds}ms`)

  return parts.join(' ')

}
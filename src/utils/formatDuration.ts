/**
 * Formats session duration for presentation
 * on the UI.
 *
 * @param duration The duration time in minutes.
 */
export const formatDuration = (duration: number) => {
  if (duration < 60) {
    return `${duration}m`
  }

  const remainingMinutes = duration % 60
  const hours = duration / 60

  if (remainingMinutes === 0) {
    return `${hours}h`
  }

  return `${Math.floor(hours)}h ${Math.round(remainingMinutes)}m`
}
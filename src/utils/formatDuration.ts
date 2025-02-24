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

  const minutes = duration % 60
  const totalHours = Math.floor(duration / 60)
  const hours = totalHours % 24
  const days = Math.floor(totalHours / 24)

  if (days > 0) {
    if (hours === 0 && minutes === 0) {
      return `${days}d`
    } else if (hours === 0) {
      return `${days}d ${minutes}m`
    } else if (minutes === 0) {
      return `${days}d ${hours}h`
    }
    return `${days}d ${hours}h ${minutes}m`
  }

  if (minutes === 0) {
    return `${totalHours}h`
  }

  return `${totalHours}h ${minutes}m`
}
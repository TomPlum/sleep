import { formatDuration } from 'utils/formatDuration'

describe('Format Duration Utility', () => {
  it('should format a duration that is less than 1 hour', () => {
    const duration = 36
    const formattedDuration = formatDuration(duration)
    expect(formattedDuration).toBe('36m')
  })

  it('should format a duration that is more than 1 hour', () => {
    const duration = 97
    const formattedDuration = formatDuration(duration)
    expect(formattedDuration).toBe('1h 37m')
  })

  it('should format a duration that is more than 24 hours', () => {
    const duration = (60 * 24) + 51
    const formattedDuration = formatDuration(duration)
    expect(formattedDuration).toBe('1d 51m')
  })

  it('should format a duration that is 0', () => {
    const duration = 0
    const formattedDuration = formatDuration(duration)
    expect(formattedDuration).toBe('0m')
  })

  it.each([1, 5, 8, 12])('should format a duration that is exactly %s hour(s)', (hours: number) => {
    const duration = hours * 60
    const formattedDuration = formatDuration(duration)
    expect(formattedDuration).toBe(`${hours}h`)
  })
})
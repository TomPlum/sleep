import { Benchmark } from 'modules/worker'
import { beforeEach } from 'vitest'

describe('Benchmark Utility Class', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should return the delta in ms if the delta is < 1000ms', () => {
    const benchmark = new Benchmark()

    benchmark.start()
    vi.advanceTimersByTime(867)
    benchmark.stop()

    expect(benchmark.delta).toBe('867ms')
  })

  it('should return the delta in seconds and ms if the delta is > 1000ms', () => {
    const benchmark = new Benchmark()

    benchmark.start()
    vi.advanceTimersByTime(12564)
    benchmark.stop()

    expect(benchmark.delta).toBe('12s 564ms')
  })
})
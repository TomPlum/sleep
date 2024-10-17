import { renderHook } from '@testing-library/react'
import { useLinearRegression } from 'data/useLinearRegression/useLinearRegression.ts'
import { SleepMetric } from 'modules/controls/MetricConfiguration'
import { SleepSessionGraph2DData } from 'modules/graph/components/SleepSessionsGraph2D'
import { LinearRegressionPlotPoint } from 'data/useLinearRegression/types.ts'

const mockSleepContext = vi.fn()
vi.mock('context/useSleepContext', () => ({
  useSleepContext: () => mockSleepContext()
}))

const validGraphData2D: SleepSessionGraph2DData = [
  {
    xDate: 1724454000000,
    date: new Date(2024, 7, 24),
    duration: 520,
    [SleepMetric.AWAKE_TIME]: 10,
    [SleepMetric.DEEP_SLEEP]: 60,
    [SleepMetric.LIGHT_SLEEP]: 300,
    [SleepMetric.QUALITY]: 84,
    [SleepMetric.REM_SLEEP]: 70
  },
  {
    xDate: 1724540400000,
    date: new Date(2024, 7, 25),
    duration: 520,
    [SleepMetric.AWAKE_TIME]: 10,
    [SleepMetric.DEEP_SLEEP]: 20,
    [SleepMetric.LIGHT_SLEEP]: 300,
    [SleepMetric.QUALITY]: 84,
    [SleepMetric.REM_SLEEP]: 70
  }
]

describe('Linear Regression Hook', () => {
  it('should return a valid array of straight-line coordinates for the regression line data', () => {
    mockSleepContext.mockReturnValueOnce({
      sleepMetric: SleepMetric.DEEP_SLEEP,
      graphData2d: {
        data: validGraphData2D,
        isSleepDataLoading: false
      }
    })

    const { result } = renderHook(useLinearRegression)

    expect(result.current.regressionLineData).toStrictEqual<LinearRegressionPlotPoint[]>([
      {
        xDate: 1724454000000,
        y: 59.99999932863284,
      },
      {
        xDate: 1724540400000,
        y: 20.000000671483576,
      },
    ])
  })

  it('should return a the y-ordinate that the regression line delta triangles horizontal line intercepts the y-axis', () => {
    mockSleepContext.mockReturnValueOnce({
      sleepMetric: SleepMetric.DEEP_SLEEP,
      graphData2d: {
        data: validGraphData2D,
        isSleepDataLoading: false
      }
    })

    const { result } = renderHook(useLinearRegression)

    expect(result.current.yRegressionDeltaLine).toBe(59.99999932863284)
  })

  it('should return a the x-ordinate (as epoch ms) that the regression line delta triangles vertical line intercepts the x-axis', () => {
    mockSleepContext.mockReturnValueOnce({
      sleepMetric: SleepMetric.DEEP_SLEEP,
      graphData2d: {
        data: validGraphData2D,
        isSleepDataLoading: false
      }
    })

    const { result } = renderHook(useLinearRegression)

    expect(result.current.xRegressionDeltaLine).toBe(1724540400000)
  })

  it('should return the difference between the highest and lowest sleep metric value as the regression line delta', () => {
    mockSleepContext.mockReturnValueOnce({
      sleepMetric: SleepMetric.DEEP_SLEEP,
      graphData2d: {
        data: validGraphData2D,
        isSleepDataLoading: false
      }
    })

    const { result } = renderHook(useLinearRegression)

    expect(result.current.regressionDelta).toBeCloseTo(-40.0)
  })

  it('should return the current sleep metric enum string as the data key', () => {
    mockSleepContext.mockReturnValue({
      sleepMetric: SleepMetric.DEEP_SLEEP,
      graphData2d: {
        data: [{
          _date: 'Aug 25',
          date: new Date(2024, 7, 25),
          duration: 520,
          [SleepMetric.AWAKE_TIME]: 10,
          [SleepMetric.DEEP_SLEEP]: 20,
          [SleepMetric.LIGHT_SLEEP]: 300,
          [SleepMetric.QUALITY]: 84,
          [SleepMetric.REM_SLEEP]: 70
        }],
        isSleepDataLoading: false
      }
    })

    const { result } = renderHook(useLinearRegression)

    expect(result.current.regressionDataKey).toBe(SleepMetric.DEEP_SLEEP)
  })
})
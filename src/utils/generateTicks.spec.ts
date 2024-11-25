import { generateTicks } from 'utils/generateTicks'

describe('Generate Ticks Utility', () => {
  it('should generate tick date instances for every hour between the start and end dates', () => {
    const ticks = generateTicks({
      start: new Date(2024, 11, 1, 3, 0, 0),
      end: new Date(2024, 11, 1, 7, 0 ,0),
      unit: 'hours',
      interval: 1
    })

    expect(ticks).toStrictEqual([
      new Date(2024, 11, 1, 3, 0, 0),
      new Date(2024, 11, 1, 4, 0, 0),
      new Date(2024, 11, 1, 5, 0, 0),
      new Date(2024, 11, 1, 6, 0, 0),
      new Date(2024, 11, 1, 7, 0, 0)
    ])
  })

  it('should generate tick date instances for every minute between the start and end dates', () => {
    const ticks = generateTicks({
      start: new Date(2024, 11, 1, 3, 10, 0),
      end: new Date(2024, 11, 1, 3, 15 ,0),
      unit: 'minutes',
      interval: 1
    })

    expect(ticks).toStrictEqual([
      new Date(2024, 11, 1, 3, 10, 0),
      new Date(2024, 11, 1, 3, 11, 0),
      new Date(2024, 11, 1, 3, 12, 0),
      new Date(2024, 11, 1, 3, 13, 0),
      new Date(2024, 11, 1, 3, 14, 0),
      new Date(2024, 11, 1, 3, 15, 0)
    ])
  })
})
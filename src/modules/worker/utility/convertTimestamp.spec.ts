import { convertTimestamp } from 'modules/worker'

describe('Convert Timestamp Utility', () => {
  it('should add 31 years to the timestamp to correct the Pillow offset', () => {
    // This date is Mon Aug 31 1987 01:19:37 GMT+0100 (British Summer Time)
    const fractionalTimestamp = 557367577.554087
    const convertedTimestamp = convertTimestamp(fractionalTimestamp)

    // These values should not be affected
    expect(convertedTimestamp.getMonth()).toBe(7)
    expect(convertedTimestamp.getDate()).toBe(31)
    expect(convertedTimestamp.getHours()).toBe(1)
    expect(convertedTimestamp.getMinutes()).toBe(19)
    expect(convertedTimestamp.getSeconds()).toBe(37)

    // But the year should be 31 years in the future
    expect(convertedTimestamp.getFullYear()).toBe(2018)
  })
})
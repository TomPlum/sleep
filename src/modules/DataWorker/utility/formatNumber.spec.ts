import { formatNumber } from 'modules/DataWorker'

describe('Format Number', () => {
  it('should add a comma after the third digit for a six digit number', () => {
    const number = 678924
    const formatted = formatNumber(number)
    expect(formatted).toBe('678,924')
  })

  it('should add a comma after the first digit for a four digit number', () => {
    const number = 2954
    const formatted = formatNumber(number)
    expect(formatted).toBe('2,954')
  })
})
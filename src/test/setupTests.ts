import { afterEach } from 'vitest'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

afterEach(() => {
  vi.resetAllMocks()
})
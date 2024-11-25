import dayjs, { ManipulateType } from 'dayjs'

export interface GenerateTicksProps {
  start: Date
  end: Date
  unit: ManipulateType
  interval: number
}

export const generateTicks = ({ start, end, unit, interval }: GenerateTicksProps) => {
  const startTime = dayjs(start)
  const endTime = dayjs(end)

  const times: Date[] = []
  let current = startTime

  while (current.isBefore(endTime) || current.isSame(endTime)) {
    times.push(current.toDate())
    current = current.add(interval, unit)
  }

  return times
}
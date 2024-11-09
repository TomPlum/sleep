export interface RawSleepDataLoadEvent {
  done: boolean
  line: number
  percentage: number
}

export interface RawSleepDataProps {
  onLoadEvent?: (event: RawSleepDataLoadEvent) => void
}
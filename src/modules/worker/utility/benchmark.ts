import { formatTimeElapsed } from 'data/utils/formatTimeElapsed'

export class Benchmark {
  private _start: Date | undefined
  private _end: Date | undefined

  public start() {
    this._start = new Date()
  }

  public stop() {
    this._end = new Date()
  }

  public get delta() {
    if (!this._start || !this._end) {
      return 'an unknown time'
    }

    const timeDelta = this._end.getTime() - this._start.getTime()

    return formatTimeElapsed({ time: timeDelta })
  }
}
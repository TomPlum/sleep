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
      return 'unknown'
    }

    const timeDelta = this._end.getTime() - this._start.getTime()

    if (timeDelta < 1000) {
      return `${timeDelta}ms`
    }

    const ms = timeDelta % 1000
    const s = Math.floor(timeDelta / 1000)

    return `${s}s ${ms}ms`
  }
}
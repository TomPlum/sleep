import { SleepSessionSound, SleepSessionStage } from 'data/useSleepData'
import { DataWorkerMessageEvent, DataWorkerResult } from 'data/useDataWorker/types'

export enum DataWorkerStatus {
  NOT_STARTED = 'not-started',
  STARTING = 'starting',
  SLEEP_STAGE_DATA = 'sleep-stages',
  SOUND_DATA = 'sound-data',
  FINISHING = 'finishing',
  DONE = 'done',
  ERROR = 'error'
}

export default () => {
  self.addEventListener('message', (e: MessageEvent<DataWorkerMessageEvent>) => {
    const parse = ({ sessions, stages, sounds }: DataWorkerMessageEvent) => {
      self.postMessage({
        loading: true,
        status: DataWorkerStatus.STARTING
      })

      /**
       * Converts the raw stage value into an enum value string.
       *
       * This function must be nested in its parent function
       * so it can be accessed in the same scope as the web worker.
       *
       * @param rawStageValue The raw stage numerical discriminator value.
       */
      const parseSleepStage = (rawStageValue: number): string => {
        // TODO: Can we strongly type this inside the worker?
        switch (rawStageValue) {
          case 0.0: {
            return 'awake_time'
          }
          case 1.0: {
            return 'rem_sleep'
          }
          case 2.0: {
            return 'light_sleep'
          }
          case 3.0: {
            return 'deep_sleep'
          }
          default: {
            throw new Error(`Invalid Sleep Stage Value [${rawStageValue}]`)
          }
        }
      }

      /**
       * For some reason the raw Pillow database export
       * has fractional UNIX timestamps that have correct
       * dates and months but the years are 31 years in
       * the past.
       *
       * This function must be nested in its parent function
       * so it can be accessed in the same scope as the web worker.
       *
       * @param rawTimestamp The raw timestamp from the export.
       */
      const parseRawTimestamp = (rawTimestamp: number): Date => {
        // For some reason, one (or maybe more) of the timestamps have an ƒ character in them
        // TODO: Check a fresh export, did I add this f character by accident while trying to crtl + f?
        const sanitised = Number(rawTimestamp.toString().replace('ƒ', ''))

        // TODO: Can we restore this dayjs logic while in the worker?
        // dayjs(new Date(sanitised * 1000)).add(31, 'years').toDate()
        const date = new Date(sanitised * 1000)
        date.setFullYear(date.getFullYear() + 31)

        return date
      }

      const result =  Object.keys(sessions).reduce<DataWorkerResult>((acc, sessionKey, i) => {
        self.postMessage({
          loading: true,
          status: DataWorkerStatus.SLEEP_STAGE_DATA
        })

        // TODO: Reduce runtime complexity here by looping less
        const sessionStages = Object.values(stages).filter(stageData => {
          return stageData.ZSLEEPSESSION === Number(sessionKey)
        }).map<SleepSessionStage>(stageData => ({
          id: stageData.ZUNIQUEIDENTIFIER,
          stage: parseSleepStage(stageData.ZSLEEPSTAGE),
          timestamp: parseRawTimestamp(stageData.ZTIMESTAMP)
        }))

        self.postMessage({
          loading: true,
          status: DataWorkerStatus.SOUND_DATA
        })

        const sessionSound = Object.values(sounds).filter(soundData => {
          return soundData.ZSLEEPSESSION === Number(sessionKey)
        }).map<SleepSessionSound>(stageData => ({
          id: stageData.ZUNIQUEIDENTIFIER,
          timestamp: parseRawTimestamp(stageData.ZTIMESTAMP),
          duration: stageData.ZDURATION
        }))


        const sessionId = `session-${i}`

        acc.sleepStages[sessionId] = sessionStages
        acc.sounds[sessionId] = sessionSound

        return acc
      }, { sleepStages: {}, sounds: {} })

      self.postMessage({
        loading: true,
        status: DataWorkerStatus.FINISHING
      })

      return result
    }

    try {
      const result = parse({
        sessions: e.data.sessions,
        sounds: e.data.sounds,
        stages: e.data.stages
      })

      return postMessage({
        result,
        loading: false,
        status: DataWorkerStatus.DONE
      })
    } catch (e) {
      return postMessage({
        error: e,
        loading: false
      })
    }
  })
}
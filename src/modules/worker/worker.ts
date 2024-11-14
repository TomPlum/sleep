import { SleepSessionSound, SleepSessionStage } from 'data/useSleepData'
import { DataWorkerMessageEvent, DataWorkerResult, DataWorkerStatusCode } from 'modules/worker/hooks/useDataWorker'
import { formatNumber, readFile, scanTables, convertSleepStage, convertTimestamp, sendMessage } from 'modules/worker/utility'

self.addEventListener('message', async () => {

  const parseTableData = ({ sessions, stages, sounds }: DataWorkerMessageEvent) => {
    const timeStart = new Date()

    const sessionKeys = Object.keys(sessions)
    const sessionCount = sessionKeys.length

    const getSoundsBySession = () => {
      const soundsBySession = new Map<number, SleepSessionSound[]>()

      sendMessage({
        loading: true,
        status: {
          code: DataWorkerStatusCode.EXTRACT_SOUND_DATA,
          payload: 'Extracting session sound data points...'
        }
      })

      Object.values(sounds).forEach(soundData => {
        const sessionId = soundData.ZSLEEPSESSION

        const soundEntry: SleepSessionSound = {
          id: soundData.ZUNIQUEIDENTIFIER,
          timestamp: convertTimestamp(soundData.ZTIMESTAMP),
          duration: soundData.ZDURATION,
        }

        if (!soundsBySession.has(sessionId)) {
          soundsBySession.set(sessionId, [])
        }

        soundsBySession.get(sessionId)!.push(soundEntry)
      })

      sendMessage({
        loading: true,
        status: {
          code: DataWorkerStatusCode.EXTRACT_SOUND_DATA,
          payload: `Extracted ${Object.keys(sounds).length} sound data points.`
        }
      })

      return soundsBySession
    }

    const getStagesBySession = () => {
      const stagesBySession = new Map<number, SleepSessionStage[]>()

      sendMessage({
        loading: true,
        status: {
          code: DataWorkerStatusCode.EXTRACT_STAGE_DATA,
          payload: 'Extracting session stage data points...'
        }
      })

      // Populate the stages map
      Object.values(stages).forEach(stageData => {
        const sessionId = stageData.ZSLEEPSESSION

        const stageEntry: SleepSessionStage = {
          id: stageData.ZUNIQUEIDENTIFIER,
          stage: convertSleepStage(stageData.ZSLEEPSTAGE),
          timestamp: convertTimestamp(stageData.ZTIMESTAMP),
        }

        if (!stagesBySession.has(sessionId)) {
          stagesBySession.set(sessionId, [])
        }

        stagesBySession.get(sessionId)!.push(stageEntry)
      })

      sendMessage({
        loading: true,
        status: {
          code: DataWorkerStatusCode.EXTRACT_STAGE_DATA,
          payload: `Extracted ${formatNumber(Object.keys(stages).length)} session stage instances.`
        }
      })

      return stagesBySession
    }

    setTimeout(() => {
      const stagesBySession = getStagesBySession()

      setTimeout(() => {
        const soundsBySession = getSoundsBySession()

        setTimeout(() => {
          sendMessage({
            loading: true,
            status: {
              code: DataWorkerStatusCode.ASSOCIATE_SESSION_DATA,
              percent: 0,
              payload: 'Processing sleep stage and sound data...',
            }
          })

          // Now reduce with preprocessed maps
          const result = sessionKeys.reduce<DataWorkerResult>((acc, sessionPrimaryKey, i) => {
            const sessionId = Number(sessionPrimaryKey)
            acc.sleepStages[sessionPrimaryKey] = stagesBySession.get(sessionId) || []
            acc.sounds[sessionPrimaryKey] = soundsBySession.get(sessionId) || []
            acc.sessions[sessionPrimaryKey] = sessions[sessionPrimaryKey]

            sendMessage({
              loading: true,
              status: {
                code: DataWorkerStatusCode.ASSOCIATE_SESSION_DATA,
                percent: ((i + 1) / sessionCount) * 100,
                payload: `Processing sleep stage and sound data for session ${i + 1}...`,
              }
            })

            return acc
          }, { sessions: {}, sleepStages: {}, sounds: {} })

          const timeEnd = new Date()
          const timeDelta = timeEnd.getTime() - timeStart.getTime()

          sendMessage({
            loading: false,
            status: {
              code: DataWorkerStatusCode.ASSOCIATE_SESSION_DATA,
              percent: 100,
              payload: `Processed ${formatNumber(sessionCount)} sleep sessions in ${timeDelta}ms.`
            }
          })

          setTimeout(() => {
            sendMessage({
              result,
              loading: false,
              status: {
                code: DataWorkerStatusCode.FINISHING,
                payload: 'Plotting sleep session graphs...',
                percent: 100,
              }
            })
          }, 1000)

          setTimeout(() => finish(result), 3500)
        }, 100)
      }, 100)
    }, 100)
  }

  const finish = (result: DataWorkerResult) => {
    return sendMessage({
      result,
      loading: false,
      status: {
        code: DataWorkerStatusCode.DONE,
        payload: 'Ready!',
        percent: 100
      }
    })
  }

  try {
    const { fileContents } = await readFile()

    setTimeout(() => {
      const { sessions, sounds, stages } = scanTables({ fileContents })

      setTimeout(() => {
        parseTableData({ sessions, sounds, stages })
      }, 100)
    }, 100)

  } catch (error) {
    return sendMessage({
      error: error as Error,
      loading: false,
      status: {
        code: DataWorkerStatusCode.ERROR
      }
    })
  }
})
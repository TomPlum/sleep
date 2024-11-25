import { SleepStage } from 'data/useSleepData'

/**
 * Converts the raw stage value into an enum value string.
 *
 * This function must be nested in its parent function
 * so it can be accessed in the same scope as the web DataWorker.
 *
 * @param rawStageValue The raw stage numerical discriminator value.
 */
export const convertSleepStage = (rawStageValue: number): SleepStage => {
  switch (rawStageValue) {
    case 0.0: {
      return 'deep_sleep' as SleepStage
    }
    case 1.0: {
      return 'light_sleep' as SleepStage
    }
    case 2.0: {
      return 'rem_sleep' as SleepStage
    }
    case 3.0: {
      return 'awake_time' as SleepStage
    }
    default: {
      throw new Error(`Invalid Sleep Stage Value [${rawStageValue}]`)
    }
  }
}
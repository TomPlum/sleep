import { PillowSleepData, SleepSessionSound, SleepSessionStage } from 'data/useSleepData'

export type RawSleepSessions = Record<string, RawSleepSessionData>
export type RawSleepSessionStages = Record<string, SleepSessionStage[]>
export type RawSleepSessionSounds = Record<string, SleepSessionSound[]>

export interface RawSleepData {
  loading: boolean
  sessionStages: RawSleepSessionStages
  sessionSounds: RawSleepSessionSounds
  sleepData?: PillowSleepData
}

/**
 * Available table names from the
 * raw database export file. A table
 * is denoted by a single word on its
 * own line and is proceeded by the data entries
 * for that table.
 *
 * They enum is ordered in the order that the tables
 * appear in the file from top to bottom.
 */
export enum RawSleepDataTable {
  SLEEP_SESSION_V5 = 'Z_5SLEEPSESSION',
  METADATA = 'Z_METADATA',
  MODEL_CACHE = 'Z_MODELCACHE',
  UB_METADATA = 'Y_UBMETA',
  UB_RANGE = 'Y_UBRANGE',
  UBKVS = 'Y_UBKVS',
  SNOOZE_LAB = 'ZSNOOZELAB',
  SLEEP_NOTES = 'ZSLEEPNOTE',
  PILLOW_USER = 'ZPILLOWUSER',
  SOUND_DATA_POINTS = 'ZSOUNDDATAPOINT',
  CHANGES = 'ACHANGE',
  TRANSACTIONS = 'ATRANSACTION',
  TRANSACTION_STRINGS = 'ATRANSACTIONSTRING',
  SLEEP_STAGES = 'ZSLEEPSTAGEDATAPOINT',
  SLEEP_SESSION = 'ZSLEEPSESSION',
  SNOOZE_LAB_ITEMS = 'ZSNOOZELABITEM',
  SLEEP_AID_LOG = 'ZSLEEPAIDLOG',
  SLEEP_DATA_FAVOURITE_TRACK = 'ZSLEEPAIDFAVORITETRACK',
  ALARMS = 'ZALARM',
  PRIMARY_KEYS = 'Z_PRIMARYKEY'
}

export interface RawSleepSessionData {
  ZSLEEPTRACKINGMETHODRAW: number
  ZANALYSISALGORITHMRAW: number
  ZPRODUCEDBYAPPLEWATCH: number
  ZUNIQUEIDENTIFIER: string
  ZTIMETOSLEEP: number
  ZTIMEINREMSLEEP: number
  ZTIMEINLIGHTSLEEP: number
  ZTIMEINDEEPSLEEP: number
  ZTIMEAWAKEUNTILSTOPPING: number
  ZTIMEAWAKE: number
  ZSTARTTIME: number
  ZSMARTWAKEUPDURATION: number
  ZSLEEPQUALITY: number
  ZFATIGUE: number
  ZENDTIME: number
  ZDURATION: number
  ZWAKEUPMOOD: number
  ZUSEDAPPLEWATCH: number
  ZSYNCEDTORUNKEEPER: number
  ZPHYSICALACTIVITYORIGIN: number
  ZNUMBEROFSNOOZES: number
  ZNUMBEROFAWAKENINGS: number
  ZNAPTYPERAW: number
  ZISNAP: number
  ZISEDITED: number
  ZGROSSMOTIONSINSESSION: number
  ZAUTOMATICSESSION: number
  ZALARMTYPERAW: number
  Z_OPT: number
  Z_ENT: number
  Z_PK: number
}

export interface RawSleepSoundPointData {
  ZRAWCATEGORY: number
  ZISSTARRED: number
  ZUNIQUEIDENTIFIER: string
  ZFILENAME: string
  ZTIMESTAMP: number
  ZSLEEPSTAGE: number
  ZSLEEPSESSION: number
  ZDURATION: number
  Z_OPT: number
  Z_ENT: number
  Z_PK: number
}

export interface RawSleepStageData {
  ZUNIQUEIDENTIFIER: string
  ZTIMESTAMP: number
  ZSOUNDLEVEL: number
  ZSLEEPSTAGE: number
  ZSLEEPSESSION: number
  Z_OPT: number
  Z_ENT: number
  Z_PK: number
}
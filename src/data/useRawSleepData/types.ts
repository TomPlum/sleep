export interface RawSleepDataLoadEvent {
  done: boolean
  line: number
  percentage: number
}

export interface RawSleepDataProps {
  onLoadEvent?: (event: RawSleepDataLoadEvent) => void
}

export interface RawSleepSessionData {
  ZSLEEPTRACKINGMETHODRAW: number
  ZANALYSISALGORITHMRAW: number
  ZPRODUCEDBYAPPLEWATCH: number
  ZUNIQUEIDENTIFIER: 308462a7876101903f9e331c19083534
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
  ZUNIQUEIDENTIFIER: '399cfd6b3da6904ff9b7c57fdaa44406'
  ZFILENAME: '16082018-232329.caf'
  ZTIMESTAMP: number
  ZSLEEPSTAGE: number
  ZSLEEPSESSION: number
  ZDURATION: number
  Z_OPT: number
  Z_ENT: number
  Z_PK: number
}
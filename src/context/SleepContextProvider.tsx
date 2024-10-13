import {SleepContext} from "context/SleepContext.ts";
import {PropsWithChildren, useMemo} from "react";
import {SleepContextBag} from "context/types.ts";
import {useSleepData} from "data/useSleepData";

export const SleepContextProvider = ({ children }: PropsWithChildren) => {
  const { sleepData, loading } = useSleepData()

  const value = useMemo<SleepContextBag>(() => ({
    sleepData,
    isSleepDataLoading: loading
  }), [loading, sleepData])

  return (
      <SleepContext.Provider value={value}>
        {children}
      </SleepContext.Provider>
  )
}
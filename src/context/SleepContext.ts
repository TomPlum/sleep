import {createContext} from "react";
import {SleepContextBag} from "context/types.ts";

export const SleepContext = createContext<SleepContextBag>({
  sleepData: {
    sessions: [],
    earliestSession: new Date(),
    latestSession: new Date()
  },
  isSleepDataLoading: true
})
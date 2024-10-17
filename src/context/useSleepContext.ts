import {useContext} from "react"
import {SleepContext} from "context/SleepContext.ts"

export const useSleepContext = () => useContext(SleepContext)
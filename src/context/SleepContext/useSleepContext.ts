import { useContext } from 'react'
import { SleepContext } from 'context/SleepContext/SleepContext'

export const useSleepContext = () => useContext(SleepContext)
import { useContext } from 'react'
import { SleepContext } from 'context/SleepContext'

export const useSleepContext = () => useContext(SleepContext)
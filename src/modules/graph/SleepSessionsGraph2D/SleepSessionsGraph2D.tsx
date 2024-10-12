import {CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {useSleepData} from "data/useSleepData";
import {useMemo} from "react";
import styles from './SleepSessionGraph2D.module.scss'

export const SleepSessionsGraph2D = () => {
  const { sleepData, loading } = useSleepData()

  const data = useMemo(() => {
    return sleepData?.sessions.map(session => ({
      date: session.startTime.toString(),
      quality: session.sleepQuality
    }))
  }, [sleepData])

  if (loading) {
    return 'Loading...'
  }

  return (
      <div className={styles.container}>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis dataKey='quality' />
            <Line type='monotone' dataKey='quality' />
          </LineChart>
        </ResponsiveContainer>
      </div>
  )
}
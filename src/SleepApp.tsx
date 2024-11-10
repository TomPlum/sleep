import { SleepContextProvider } from 'context/SleepContextProvider'
import styles from './SleepApp.module.scss'
import { Outlet } from 'react-router-dom'
import { useRawSleepData } from 'data/useRawSleepData'

const SleepApp = () => {
  const rawSleepData = useRawSleepData()

  return (
    <div className={styles.container}>
      <SleepContextProvider rawData={rawSleepData}>
        <Outlet/>
      </SleepContextProvider>
    </div>
  )
}

export default SleepApp

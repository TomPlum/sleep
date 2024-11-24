import { SleepContextProvider } from 'context/SleepContext/SleepContextProvider'
import styles from './SleepApp.module.scss'
import { Outlet } from 'react-router-dom'
import { ChartConfigContextProvider } from 'context/ChartConfigContext'

const SleepApp = () => {
  return (
    <div className={styles.container}>
      <SleepContextProvider>
        <ChartConfigContextProvider>
          <Outlet/>
        </ChartConfigContextProvider>
      </SleepContextProvider>
    </div>
  )
}

export default SleepApp

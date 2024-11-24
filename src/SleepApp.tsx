import { SleepContextProvider } from 'context/SleepContext/SleepContextProvider.tsx'
import styles from './SleepApp.module.scss'
import { Outlet } from 'react-router-dom'

const SleepApp = () => {
  return (
    <div className={styles.container}>
      <SleepContextProvider>
        <Outlet/>
      </SleepContextProvider>
    </div>
  )
}

export default SleepApp

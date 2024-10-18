import { SleepContextProvider } from 'context/SleepContextProvider'
import styles from './SleepApp.module.scss'
import { Outlet } from 'react-router-dom'

const SleepApp = () => (
    <div className={styles.container}>
      <SleepContextProvider>
        <Outlet />
      </SleepContextProvider>
    </div>
)

export default SleepApp

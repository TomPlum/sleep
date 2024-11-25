import { SleepContextProvider } from 'context/SleepContext/SleepContextProvider'
import styles from './SleepApp.module.scss'
import { Outlet } from 'react-router-dom'
import { ChartConfigContextProvider } from 'context/ChartConfigContext'
import { SleepErrorBoundary } from 'components/ErrorBoundary'

const SleepApp = () => {
  return (
    <div className={styles.container}>
      <SleepErrorBoundary>
        <ChartConfigContextProvider>
          <SleepContextProvider>
            <Outlet/>
          </SleepContextProvider>
        </ChartConfigContextProvider>
      </SleepErrorBoundary>
    </div>
  )
}

export default SleepApp

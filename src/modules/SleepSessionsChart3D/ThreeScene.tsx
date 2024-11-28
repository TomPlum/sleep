import { useCallback, useRef } from 'react'
import { ThreeControls } from 'modules/SleepSessionsChart3D/components/ThreeControls'
import styles from './ThreeScene.module.scss'
import { ThreeConfigContextProvider } from 'context/ThreeConfigContext'
import { ThreeChart } from 'modules/SleepSessionsChart3D/components/ThreeChart'
import { ThreeChartRef } from 'modules/SleepSessionsChart3D/components/ThreeChart/types'

export const ThreeScene = () => {
  const graphRef = useRef<ThreeChartRef>(null)

  const handleResetCamera = useCallback(() => {
    graphRef.current?.resetCamera()
  }, [])

  return (
    <ThreeConfigContextProvider resetCamera={handleResetCamera}>
      <div className={styles.container}>
        <ThreeControls />
        <ThreeChart ref={graphRef} />
      </div>
    </ThreeConfigContextProvider>
  )
}
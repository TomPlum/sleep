import { useCallback, useRef } from 'react'
import { ThreeControls } from 'modules/SleepSessionsChart3D/components/ThreeControls'
import styles from './ThreeScene.module.scss'
import { ThreeConfigContextProvider } from 'context/ThreeConfigContext'
import { ThreeChart } from 'modules/SleepSessionsChart3D/components/ThreeChart'
import { ForceGraph3DInstance } from '3d-force-graph'

export const ThreeScene = () => {
  const graphRef = useRef<ForceGraph3DInstance>(null)

  const handleResetCamera = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.cameraPosition(
        { x: 0, y: 0, z: 0 },
        undefined, 1000
      )
    }
  }, [])

  return (
    <ThreeConfigContextProvider onResetCamera={handleResetCamera}>
      <div className={styles.container}>
        <ThreeControls resetCamera={handleResetCamera}/>
        <ThreeChart ref={graphRef} />
      </div>
    </ThreeConfigContextProvider>
  )
}
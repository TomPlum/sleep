import { useCallback, useRef } from 'react'
import { ThreeControls } from 'modules/SleepSessionsChart3D/components/ThreeControls'
import styles from './ThreeScene.module.scss'
import { ThreeConfigContextProvider } from 'context/ThreeConfigContext'
import { SleepSessionsGraph3D } from 'modules/SleepSessionsChart3D/SleepSessionsGraph3D'
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
        <SleepSessionsGraph3D ref={graphRef} />
      </div>
    </ThreeConfigContextProvider>
  )
}
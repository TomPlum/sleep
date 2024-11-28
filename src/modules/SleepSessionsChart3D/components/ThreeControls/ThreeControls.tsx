import { AsciiCheckbox } from 'modules/ChartControls/components/AsciiCheckbox'
import { useTranslation } from 'react-i18next'
import styles from './ThreeControls.module.scss'
import { useThreeConfigContext } from 'context/ThreeConfigContext'
import { AsciiButton } from 'modules/ChartControls/components/AsciiButton'
import { ThreeControlProps } from 'modules/SleepSessionsChart3D/components/ThreeControls/types'
import { useCallback, useState } from 'react'

export const ThreeControls = ({ resetCamera }: ThreeControlProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph3d.controls' })
  const { showAxes, setShowAxes, draggableNodes, setDraggableNodes } = useThreeConfigContext()

  const [resettingCamera, setResettingCamera] = useState(false)

  const handleResetCamera = useCallback(() => {
    setResettingCamera(true)
    resetCamera()
  }, [resetCamera])

  return (
    <div className={styles.threeControls}>
      <AsciiCheckbox
        checked={showAxes}
        label={t('showAxes')}
        onToggle={() => setShowAxes(!showAxes)}
      />

      <AsciiCheckbox
        checked={draggableNodes}
        label={t('draggableNodes')}
        onToggle={() => setDraggableNodes(!draggableNodes)}
      />

      <AsciiButton
        label={t('resetCamera')}
        loading={resettingCamera}
        onClick={handleResetCamera}
      />
    </div>
  )
}
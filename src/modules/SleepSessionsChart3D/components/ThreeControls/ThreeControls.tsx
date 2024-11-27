import { AsciiCheckbox } from 'modules/ChartControls/components/AsciiCheckbox'
import { useTranslation } from 'react-i18next'
import styles from './ThreeControls.module.scss'
import { useThreeConfigContext } from 'context/ThreeConfigContext'

export const ThreeControls = () => {
  const { showAxes, setShowAxes } = useThreeConfigContext()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph3d.controls' })

  return (
    <div className={styles.threeControls}>
      <AsciiCheckbox
        checked={showAxes}
        label={t('showAxes')}
        onToggle={() => setShowAxes(!showAxes)}
      />
    </div>
  )
}
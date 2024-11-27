import { useState } from 'react'
import { AsciiCheckbox } from 'modules/ChartControls/components/AsciiCheckbox'
import { useTranslation } from 'react-i18next'
import styles from './ThreeControls.module.scss'

export const ThreeControls = () => {
  const [showAxes, setShowAxes] = useState(false)
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
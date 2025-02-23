import { AsciiCheckbox } from 'modules/ChartControls/components/AsciiCheckbox'
import { useTranslation } from 'react-i18next'
import { useChartConfigContext } from 'context/ChartConfigContext'

export const ShowHighlightsCardToggle = () => {
  const { showHighlightsCard, setShowHighlightsCard } = useChartConfigContext()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph-controls.show-highlights-toggle' })

  return (
    <AsciiCheckbox
      label={t('label')}
      checked={showHighlightsCard}
      onToggle={() => setShowHighlightsCard(!showHighlightsCard)}
    />
  )
}
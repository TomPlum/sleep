import { AsciiCheckbox } from 'modules/ChartControls/components/AsciiCheckbox'
import { useQueryParams } from 'hooks/useQueryParams'
import { useChartConfigContext } from 'context/ChartConfigContext'
import { useCallback } from 'react'
import { PageRoutes } from 'routes.ts'
import { useTranslation } from 'react-i18next'

export const ThreeDimensionsToggle = () => {
  const { updateQueryParam } = useQueryParams()
  const { is3DActive, setIs3DActive } = useChartConfigContext()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph-controls.three-dimensions-toggle' })

  const handleToggle = useCallback(() => {
    updateQueryParam({
      route: PageRoutes.SLEEP,
      params: {
        is3D: String(!is3DActive)
      }
    })

    setIs3DActive(!is3DActive)
  }, [is3DActive, setIs3DActive, updateQueryParam])

  return (
    <AsciiCheckbox
      label={t('label')}
      checked={is3DActive}
      onToggle={handleToggle}
    />
  )
}
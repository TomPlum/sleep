import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryParams } from 'hooks/useQueryParams'
import { PageRoutes } from 'routes'
import { AsciiCheckbox } from 'modules/ChartControls/components/AsciiCheckbox'

export const LocaleToggle = () => {
  const { updateQueryParam } = useQueryParams()
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'sleep.graph2d' })
  const isEnglish = i18n.language === 'en'

  const handleChangeLanguage = useCallback(async () => {
    const newLanguage = isEnglish ? 'jp' : 'en'

    await i18n.changeLanguage(newLanguage)
    
    updateQueryParam({
      route: PageRoutes.SLEEP,
      params: {
        lng: newLanguage
      }
    })
  }, [i18n, isEnglish, updateQueryParam])

  return (
    <AsciiCheckbox
      checked={!isEnglish}
      onToggle={handleChangeLanguage}
      label={t(`language.${isEnglish ? 'checked': 'unchecked'}`)}
    />
  )
}
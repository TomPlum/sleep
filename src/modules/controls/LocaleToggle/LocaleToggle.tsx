import { Switch } from 'antd'
import { useCallback } from 'react'
import styles from './LocaleToggle.module.scss'
import { useTranslation } from 'react-i18next'
import { LocaleToggleProps } from './types'
import classNames from 'classnames'
import { useQueryParams } from 'hooks/useQueryParams'
import { PageRoutes } from 'routes'

export const LocaleToggle = ({ className }: LocaleToggleProps) => {
  const { updateQueryParam } = useQueryParams()
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'sleep.graph2d' })

  const handleChangeLanguage = useCallback(async () => {
    const isEnglish = i18n.language === 'en'
    const newLanguage = isEnglish ? 'jp' : 'en'

    await i18n.changeLanguage(newLanguage)
    
    updateQueryParam({
      route: PageRoutes.SLEEP,
      params: {
        lng: newLanguage
      }
    })
  }, [i18n, updateQueryParam])

  return (
    <Switch
      size='default'
      defaultChecked
      onChange={handleChangeLanguage}
      checkedChildren={t('language.checked')}
      unCheckedChildren={t('language.unchecked')}
      className={classNames(styles.languageSwitch, className)}
    />
  )
}
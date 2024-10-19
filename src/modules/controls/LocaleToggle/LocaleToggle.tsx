import { Switch } from 'antd'
import { useCallback } from 'react'
import styles from './LocaleToggle.module.scss'
import { useTranslation } from 'react-i18next'
import { LocaleToggleProps } from './types'
import classNames from 'classnames'

export const LocaleToggle = ({ className }: LocaleToggleProps) => {
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'sleep.graph2d' })

  const handleChangeLanguage = useCallback(async () => {
    const isEnglish = i18n.language === 'en'
    await i18n.changeLanguage(isEnglish ? 'jp' : 'en')
  }, [i18n])

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
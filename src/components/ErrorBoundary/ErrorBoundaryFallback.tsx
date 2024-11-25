import styles from './ErrorBoundaryFallback.module.scss'
import { ErrorBoundaryFallbackProps } from './types'
import { useTranslation } from 'react-i18next'

export const ErrorBoundaryFallback = ({ error }: ErrorBoundaryFallbackProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.error' })

  return (
    <div className={styles.wrapper}>
      <h1>{t('title')}</h1>
      <p>{error.message}</p>
    </div>
  )
}
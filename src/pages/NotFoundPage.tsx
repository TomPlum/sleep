import { useTranslation } from 'react-i18next'
import styles from './NotFoundPage.module.scss'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { PageRoutes } from 'routes'

export const NotFoundPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('translation', { keyPrefix: 'not-found' })

  const handleClickHome = useCallback(() => {
    navigate({
      pathname: PageRoutes.SLEEP
    })
  }, [navigate])

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.status}>
          {t('status')}
        </h1>

        <h1 className={styles.heading}>
          {t('heading')}
        </h1>

        <h4 className={styles.title}>
          {t('title')}
        </h4>

        <p className={styles.message}>
          {t('message')}
        </p>

        <Button color='primary' className={styles.home} onClick={handleClickHome} size='large' variant='filled'>
          {t('home-button')}
        </Button>
      </div>
    </div>
  )
}
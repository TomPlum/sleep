import { PILLOW_DATABASE_FILE_NAME } from 'modules/DataWorker'
import { useTranslation } from 'react-i18next'
import { PillowDataFileLinksProps } from './types'

export const PillowDataFileLink = ({ className }: PillowDataFileLinksProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d.data-source' })

  return (
    <a
      title={t('title')}
      className={className}
      href={`/${PILLOW_DATABASE_FILE_NAME}`}
      download={PILLOW_DATABASE_FILE_NAME}
    >
      {PILLOW_DATABASE_FILE_NAME}
    </a>
  )
}
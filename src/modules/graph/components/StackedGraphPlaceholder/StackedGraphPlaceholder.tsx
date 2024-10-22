import styles from './StackedGraphPlaceholder.module.scss'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { StackedGraphPlaceholderProps } from 'modules/graph/components/StackedGraphPlaceholder/types'

export const StackedGraphPlaceholder = ({ id }: StackedGraphPlaceholderProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d' })
  
  return (
    <div className={styles.placeholder} key={`graph-placeholder-${id}`}>
      <InfoCircleOutlined className={styles.infoIcon}/>
      <p className={styles.selectText}>
        {t('select-second-metric')}
      </p>
    </div>
  )
}
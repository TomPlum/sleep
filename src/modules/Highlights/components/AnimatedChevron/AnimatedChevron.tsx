import styles from './AnimatedChevron.module.scss'
import { AnimatedChevronProps } from './types'
import classNames from 'classnames'

export const AnimatedChevron = ({ className, onClick }: AnimatedChevronProps) => {
  return (
    <div className={classNames(styles.arrow, className)} onClick={onClick}>
      <div className={styles['arrow-top']}></div>
      <div className={styles['arrow-bottom']}></div>
    </div>
  )
}
import { SleepingAnimationProps } from './types'
import classNames from 'classnames'
import styles from './SleepingAnimation.module.scss'

export const SleepingAnimation = ({ className }: SleepingAnimationProps) => {
  return (
    <div className={classNames(styles.sleeping, className)}>
      <span>z</span>
      <span>z</span>
      <span>z</span>
    </div>
  )
}
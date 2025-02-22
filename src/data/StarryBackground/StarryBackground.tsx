import styles from './StarryBackground.module.scss'
import { PropsWithChildren } from 'react'
import { StarryBackgroundProps } from 'data/StarryBackground/types'
import classNames from 'classnames'

export const StarryBackground = ({ className, children }: PropsWithChildren<StarryBackgroundProps>) => {
    return (
      <div className={classNames(styles.container, className)}>
        <div className={styles.stars} />
        <div className={styles.stars2} />
        <div className={styles.stars3} />

        {children}
      </div>
    )
}
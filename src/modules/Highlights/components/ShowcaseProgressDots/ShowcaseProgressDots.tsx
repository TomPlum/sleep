import classNames from 'classnames'
import styles from './ShowcaseProgressDots.module.scss'
import { ShowcaseProgressDotsProps } from './types'

export const ShowcaseProgressDots = ({
   dots,
   active,
   onClickDot,
   className,
   orientation = 'vertical'
}: ShowcaseProgressDotsProps) => {
  return (
    <div
      className={classNames(
        styles.dots,
        { [styles.horizontalDots]: orientation === 'horizontal' },
        className
      )}
    >
      {new Array(dots).fill(0).map((_, i) => (
        <div
          key={`dot-${i}`}
          className={classNames(
            styles.dot,
            { [styles.activeDot]: active === i }
          )}
          onClick={() => onClickDot(i)}
        />
      ))}
    </div>
  )
}
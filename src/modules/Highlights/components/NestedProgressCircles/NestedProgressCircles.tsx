import styles from './NestedProgressCircles.module.scss'
import { NestedProgressCirclesProps } from 'modules/Highlights/components/NestedProgressCircles/types'
import classNames from 'classnames'

export const NestedProgressCircles = ({
  size,
  strokeWidth,
  innerStrokeWidth,
  outerPercent,
  innerPercent,
  outerColor,
  innerColor,
  className
}: NestedProgressCirclesProps) => {
  const radius = (size - strokeWidth) / 2
  const innerRadius = ((size - innerStrokeWidth * 2) / 2) - strokeWidth
  const circumference = 2 * Math.PI * radius
  const innerCircumference = 2 * Math.PI * innerRadius

  const outerOffset = circumference - (outerPercent / 100) * circumference

  const innerPercentTrimmed = innerPercent > 100 ? 100 : innerPercent
  const innerOffset = circumference - (innerPercentTrimmed / 100) * innerCircumference

  return (
    <div className={classNames(styles.chart, className)}>
      <svg className={styles.percentageCircle} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          r={radius}
          fill="none"
          stroke='gray'
          cx={size / 2}
          cy={size / 2}
          className={styles.track}
          strokeWidth={strokeWidth}
        />

        <circle
          r={radius}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          stroke={outerColor}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          className={styles.progress}
          strokeDashoffset={outerOffset}
          strokeDasharray={circumference}
        />

        <circle
          fill="none"
          stroke='gray'
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          className={styles.innerTrack}
          strokeWidth={innerStrokeWidth}
        />

        <circle
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          stroke={innerColor}
          strokeLinecap="round"
          strokeDashoffset={innerOffset}
          strokeWidth={innerStrokeWidth}
          className={styles.innerProgress}
          strokeDasharray={innerCircumference}
        />
      </svg>
    </div>
  )
}
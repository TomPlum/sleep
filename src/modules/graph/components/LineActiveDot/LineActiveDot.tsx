import { LineActiveDotProps } from './types'
import { useCallback } from 'react'
import styles from './LineActiveDot.module.scss'

export const LineActiveDot = ({ data, radius, onClick }: LineActiveDotProps) => {
  const { x, y,index } = data

  const handleClick = useCallback(() => {
    onClick(`session-${index}`)
  }, [index, onClick])

  return (
    <circle
      cx={x}
      cy={y}
      r={radius}
      fill='transparent'
      onClick={handleClick}
      className={styles.dot}
    />
  )
}
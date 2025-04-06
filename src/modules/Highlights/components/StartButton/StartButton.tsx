import styles from './StartButton.module.scss'
import { StartButtonProps } from './types'
import classNames from 'classnames'

export const StartButton = ({ text, className, onClick }: StartButtonProps) => {
  return (
    <span className={classNames(styles['shiny-cta'], className)} onClick={onClick}>
      {text}
    </span>
  )
}
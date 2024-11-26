import { AsciiCheckboxProps } from 'modules/ChartControls/components/AsciiCheckbox/types'
import styles from './AsciiCheckbox.module.scss'

export const AsciiCheckbox = ({ label, checked, onToggle }: AsciiCheckboxProps) => {
  return (
    <label className={styles.label}>
      <div className={styles.box}>
        <span className={styles.openBracket}>
          [
        </span>

        <span className={styles.xCheckMark}>
          {checked ? 'x' : ''}
        </span>

        <span className={styles.closeBracket}>
          ]
        </span>
      </div>

      <input
        type='checkbox'
        checked={checked}
        onClick={onToggle}
        className={styles.checkbox}
      />

      <span className={styles.labelText}>
        {label}
      </span>
    </label>
  )
}
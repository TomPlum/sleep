import { AsciiButtonProps } from './types'
import styles from './AsciiButton.module.scss'

export const AsciiButton = ({ label, loading, onClick }: AsciiButtonProps) => {
  return (
    <label className={styles.label}>
      <div className={styles.box}>
        <span className={styles.openBracket}>
          [
        </span>

        {loading && (
          <pre className={styles.loader}>
            -
          </pre>
        )}

        {!loading && (
          <pre className={styles.placeholder}>
            !
          </pre>
        )}

        <span className={styles.closeBracket}>
          ]
        </span>
      </div>

      <button
        type='button'
        onClick={onClick}
        className={styles.button}
      />

      <span className={styles.labelText}>
        {label}
      </span>
    </label>
  )
}
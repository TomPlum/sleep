import { MetricConfiguration } from 'modules/controls/MetricConfiguration'
import styles from './GraphControls.module.scss'
import { LocaleToggle } from 'modules/controls/LocaleToggle'
import { DateRangePicker } from 'modules/controls/DateRangePicker'
import classNames from 'classnames'
import { GraphControlsProps } from './types'
import { ShowAllButton } from 'modules/controls/ShowAllButton'

export const GraphControls = ({ className }: GraphControlsProps) => {
  return (
    <div className={classNames(styles.controls, className)}>
      <MetricConfiguration
        className={styles.configPanel}
      />

      <div className={styles.bottom}>
        <LocaleToggle className={styles.localeToggle} />
        <DateRangePicker className={styles.dateRangePicker} />
        <ShowAllButton />
      </div>
    </div>
  )
}
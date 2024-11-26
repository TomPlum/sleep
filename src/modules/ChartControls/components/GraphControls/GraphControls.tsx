import { MetricConfiguration } from 'modules/ChartControls'
import styles from './GraphControls.module.scss'
import { LocaleToggle } from 'modules/ChartControls'
import { DateRangePicker } from 'modules/ChartControls'
import classNames from 'classnames'
import { GraphControlsProps } from './types'
import { ShowAllButton } from 'modules/ChartControls'
import { ChartViewSelector } from 'modules/ChartControls'

export const GraphControls = ({ className }: GraphControlsProps) => {
  return (
    <div className={classNames(styles.controls, className)}>
      <MetricConfiguration
        className={styles.configPanel}
      />

      <div className={styles.bottom}>
        <LocaleToggle className={styles.localeToggle} />
        <ChartViewSelector />
        <DateRangePicker className={styles.dateRangePicker} />
        <ShowAllButton />
      </div>
    </div>
  )
}
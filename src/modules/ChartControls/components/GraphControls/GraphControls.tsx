import { LocaleToggle, MetricConfiguration } from 'modules/ChartControls'
import styles from './GraphControls.module.scss'
import { DateRangePicker } from 'modules/ChartControls'
import classNames from 'classnames'
import { GraphControlsProps } from './types'
import { ShowAllButton } from 'modules/ChartControls'
import { ChartViewSelector } from 'modules/ChartControls'
import { ThreeDimensionsToggle } from 'modules/ChartControls/components/ThreeDimensionsToggle'
import { ShowHighlightsCardToggle } from 'modules/ChartControls/components/ShowHighlightsCardToggle'

export const GraphControls = ({ className }: GraphControlsProps) => {
  return (
    <div className={classNames(styles.controls, className)}>
      <MetricConfiguration
        className={styles.configPanel}
      />

      <div className={styles.middle}>
        <ChartViewSelector />
        <DateRangePicker className={styles.dateRangePicker} />
        <ShowAllButton />
      </div>

      <div className={styles.bottom}>
        <LocaleToggle />
        <ShowHighlightsCardToggle />
        <ThreeDimensionsToggle />
      </div>
    </div>
  )
}
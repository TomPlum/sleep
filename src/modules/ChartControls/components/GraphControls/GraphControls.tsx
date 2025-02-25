import { LocaleToggle, MetricConfiguration } from 'modules/ChartControls'
import styles from './GraphControls.module.scss'
import { DateRangePicker } from 'modules/ChartControls'
import classNames from 'classnames'
import { GraphControlsProps } from './types'
import { ShowAllButton } from 'modules/ChartControls'
import { ChartViewSelector } from 'modules/ChartControls'
import { ThreeDimensionsToggle } from 'modules/ChartControls/components/ThreeDimensionsToggle'
import { ShowHighlightsCardToggle } from 'modules/ChartControls/components/ShowHighlightsCardToggle'
import { ConfigProvider, theme } from 'antd'

export const GraphControls = ({ className }: GraphControlsProps) => {
  return (
    <div className={classNames(styles.controls, className)}>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
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
      </ConfigProvider>
    </div>
  )
}
import { MetricConfigurationProps, SleepMetric } from './types'
import styles from './MetricConfiguration.module.scss'
import classNames from 'classnames'
import { MetricCheckbox } from 'modules/controls/MetricCheckbox'

export const MetricConfiguration = ({ className }: MetricConfigurationProps) => {
  return (
    <div className={classNames(styles.container, className)}>
      <MetricCheckbox
        type='checkbox'
        metric={SleepMetric.QUALITY}
      />

      <MetricCheckbox
        type='checkbox'
        metric={SleepMetric.DEEP_SLEEP}
      />

      <MetricCheckbox
        type='checkbox'
        metric={SleepMetric.LIGHT_SLEEP}
      />

      <MetricCheckbox
        type='checkbox'
        metric={SleepMetric.REM_SLEEP}
      />

      <MetricCheckbox
        type='checkbox'
        metric={SleepMetric.AWAKE_TIME}
      />

      <MetricCheckbox
        type='checkbox'
        metric={SleepMetric.DURATION}
      />
    </div>
  )
}
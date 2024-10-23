import { MetricConfigurationProps, SleepMetric } from './types'
import styles from './MetricConfiguration.module.scss'
import classNames from 'classnames'
import { MetricCheckbox } from 'modules/controls/MetricCheckbox'

export const MetricConfiguration = ({ className }: MetricConfigurationProps) => {
  return (
    <div className={classNames(styles.container, className)}>
      <MetricCheckbox
        metric={SleepMetric.QUALITY}
      />

      <MetricCheckbox
        metric={SleepMetric.DEEP_SLEEP}
      />

      <MetricCheckbox
        metric={SleepMetric.LIGHT_SLEEP}
      />

      <MetricCheckbox
        metric={SleepMetric.REM_SLEEP}
      />

      <MetricCheckbox
        metric={SleepMetric.AWAKE_TIME}
      />

      <MetricCheckbox
        metric={SleepMetric.DURATION}
      />
    </div>
  )
}
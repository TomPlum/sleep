import {MetricConfigurationProps, SleepMetric} from "./types.ts";
import styles from './MetricConfiguration.module.scss'
import {useTranslation} from "react-i18next";
import classNames from "classnames";
import {MetricCheckbox} from "modules/controls/MetricCheckbox";

export const MetricConfiguration = ({ current, className, onMetricChange }: MetricConfigurationProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.metric-config' })

  return (
    <div className={classNames(styles.container, className)}>
      <MetricCheckbox
        currentMetric={current}
        onToggle={onMetricChange}
        metric={SleepMetric.QUALITY}
        label={t('checkbox.quality')}
      />

      <MetricCheckbox
        currentMetric={current}
        onToggle={onMetricChange}
        label={t('checkbox.deep')}
        metric={SleepMetric.DEEP_SLEEP}
      />

      <MetricCheckbox
        currentMetric={current}
        onToggle={onMetricChange}
        label={t('checkbox.light')}
        metric={SleepMetric.LIGHT_SLEEP}
      />

      <MetricCheckbox
        currentMetric={current}
        onToggle={onMetricChange}
        label={t('checkbox.rem')}
        metric={SleepMetric.REM_SLEEP}
      />

      <MetricCheckbox
        currentMetric={current}
        onToggle={onMetricChange}
        label={t('checkbox.awake')}
        metric={SleepMetric.AWAKE_TIME}
      />
    </div>
  )
}
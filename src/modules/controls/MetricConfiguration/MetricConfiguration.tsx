import {MetricConfigurationProps, SleepMetric} from "./types.ts";
import styles from './MetricConfiguration.module.scss'
import {useTranslation} from "react-i18next";
import classNames from "classnames";
import {MetricCheckbox} from "modules/controls/MetricCheckbox";

export const MetricConfiguration = ({ className }: MetricConfigurationProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.metric-config' })

  return (
    <div className={classNames(styles.container, className)}>
      <MetricCheckbox
        metric={SleepMetric.QUALITY}
        label={t('checkbox.quality')}
      />

      <MetricCheckbox
        label={t('checkbox.deep')}
        metric={SleepMetric.DEEP_SLEEP}
      />

      <MetricCheckbox
        label={t('checkbox.light')}
        metric={SleepMetric.LIGHT_SLEEP}
      />

      <MetricCheckbox
        label={t('checkbox.rem')}
        metric={SleepMetric.REM_SLEEP}
      />

      <MetricCheckbox
        label={t('checkbox.awake')}
        metric={SleepMetric.AWAKE_TIME}
      />
    </div>
  )
}
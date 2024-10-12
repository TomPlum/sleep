import {MetricConfigurationProps, SleepMetric} from "./types.ts";
import {Checkbox} from "antd";
import styles from './MetricConfiguration.module.scss'
import {useTranslation} from "react-i18next";
import {useCallback} from "react";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import classNames from "classnames";

export const MetricConfiguration = ({ current, className, onMetricChange }: MetricConfigurationProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.metric-config' })

  const handleChange = useCallback((e: CheckboxChangeEvent, metric: SleepMetric) => {
    const checked = e.target.checked
    if (checked) {
      onMetricChange(metric)
    }
  }, [onMetricChange])

  return (
    <div className={classNames(styles.container, className)}>
      <Checkbox
        checked={current === SleepMetric.QUALITY}
        onChange={e => handleChange(e, SleepMetric.QUALITY)}
      >
        {t('checkbox.quality')}
      </Checkbox>

      <Checkbox
        checked={current === SleepMetric.DEEP_SLEEP}
        onChange={e => handleChange(e, SleepMetric.DEEP_SLEEP)}
      >
        {t('checkbox.deep')}
      </Checkbox>

      <Checkbox
        checked={current === SleepMetric.LIGHT_SLEEP}
        onChange={e => handleChange(e, SleepMetric.LIGHT_SLEEP)}
      >
        {t('checkbox.light')}
      </Checkbox>

      <Checkbox
        checked={current === SleepMetric.REM_SLEEP}
        onChange={e => handleChange(e, SleepMetric.REM_SLEEP)}
      >
        {t('checkbox.rem')}
      </Checkbox>

      <Checkbox
        checked={current === SleepMetric.AWAKE_TIME}
        onChange={e => handleChange(e, SleepMetric.AWAKE_TIME)}
      >
        {t('checkbox.awake')}
      </Checkbox>
    </div>
  )
}
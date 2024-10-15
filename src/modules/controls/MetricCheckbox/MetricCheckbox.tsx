import {Checkbox} from "antd";
import styles from "./MetricCheckbox.module.scss";
import {CSSProperties, useCallback} from "react";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {useQueryParams} from "hooks/useQueryParams";
import {MetricCheckboxProps} from "modules/controls/MetricCheckbox/types.ts";
import {useGraphStyles} from "modules/graph/hooks/useGraphStyles";
import {useSleepContext} from "context";

export const MetricCheckbox = ({ label, metric }: MetricCheckboxProps) => {
  const { updateQueryParam } = useQueryParams()
  const { getMetricColour } = useGraphStyles()
  const { sleepMetric, setSleepMetric } = useSleepContext()

  const handleChange = useCallback((e: CheckboxChangeEvent) => {
    const checked = e.target.checked
    if (checked) {
      setSleepMetric(metric)

      updateQueryParam({
        route: '/',
        params: {
          metric
        }
      })
    }
  }, [metric, setSleepMetric, updateQueryParam])

  return (
    <Checkbox
      onChange={handleChange}
      className={styles.checkbox}
      style={{
        '--background-color': getMetricColour(metric),
        '--border-color': getMetricColour(metric)
      } as CSSProperties}
      checked={sleepMetric === metric}
    >
      {label}
    </Checkbox>
  )
}
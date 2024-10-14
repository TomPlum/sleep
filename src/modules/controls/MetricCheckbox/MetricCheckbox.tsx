import {Checkbox} from "antd";
import styles from "./MetricCheckbox.module.scss";
import {CSSProperties, useCallback} from "react";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {useQueryParams} from "hooks/useQueryParams";
import {MetricCheckboxProps} from "modules/controls/MetricCheckbox/types.ts";
import {useGraphStyles} from "modules/graph/hooks/useGraphStyles";

export const MetricCheckbox = ({ label, currentMetric, metric, onToggle }: MetricCheckboxProps) => {
  const { updateQueryParam } = useQueryParams()
  const { getMetricColour } = useGraphStyles()

  const handleChange = useCallback((e: CheckboxChangeEvent) => {
    const checked = e.target.checked
    if (checked) {
      onToggle(metric)

      updateQueryParam({
        route: '/sleep',
        params: {
          metric
        }
      })
    }
  }, [metric, onToggle, updateQueryParam])

  return (
    <Checkbox
      onChange={handleChange}
      className={styles.checkbox}
      style={{
        '--background-color': getMetricColour(metric),
        '--border-color': getMetricColour(metric)
      } as CSSProperties}
      checked={currentMetric === metric}
    >
      {label}
    </Checkbox>
  )
}
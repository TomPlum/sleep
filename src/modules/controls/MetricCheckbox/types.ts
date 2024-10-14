import {SleepMetric} from "modules/controls/MetricConfiguration";

export interface MetricCheckboxProps {
  label: string
  metric: SleepMetric
  currentMetric: SleepMetric
  onToggle: (metric: SleepMetric) => void
}
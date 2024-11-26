export interface AsciiCheckboxProps {
  /**
   * A text label that sits to the side
   * of the checkbox.
   */
  label: string

  /**
   * Whether the checkbox is
   * checked or not.
   */
  checked: boolean

  /**
   * A callback function invoked
   * when the user click the checkbox
   * to toggle it.
   */
  onToggle: () => void
}
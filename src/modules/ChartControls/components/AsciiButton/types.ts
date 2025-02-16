export interface AsciiButtonProps {
  /**
   * A text label that sits to the side
   * of the button.
   */
  label: string

  /**
   * Indicates that the button should
   * render in a loading state.
   */
  loading?: boolean

  /**
   * A callback function invoked
   * when the user click the button
   * to invoke its action.
   */
  onClick: () => void
}
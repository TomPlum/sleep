export interface NestedProgressCirclesProps {
  /**
   * The diameter of the outer
   * progress circle in pixels.
   */
  size: number

  /**
   * The width, in pixels, of the progress
   * stroke that moves along the circular track
   * for the outer circle.
   */
  strokeWidth: number

  /**
   * The width, in pixels, of the progress
   * stroke that moves along the circular track
   * for the inner circle.
   */
  innerStrokeWidth: number

  /**
   * The percentage value of the outer circle.
   * This value determines how much of the track
   * is filled with the progress stroke.
   *
   * 100% will be a complete circle, where-as 0%
   * will have no progress and just an empty track.
   */
  outerPercent: number

  /**
   * The colour of the outer circles'
   * progress stroke.
   */
  outerColor: string

  /**
   * The percentage value of the inner circle.
   * This value determines how much of the track
   * is filled with the progress stroke.
   *
   * 100% will be a complete circle, where-as 0%
   * will have no progress and just an empty track.
   */
  innerPercent: number

  /**
   * The colour of the inner circles'
   * progress stroke.
   */
  innerColor: string

  /**
   * An optional classname to pass to
   * the container around the circles.
   */
  className?: string
}
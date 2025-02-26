export interface NightSkySceneProps {
  /**
   * Indicates that the consumer is in a
   * loading state and that the scene should
   * render in its loading state too.
   */
  loading: boolean

  /**
   * Indicates that the consumer has finished
   * with the scene and so the scene should
   * enter its exiting state before being unmounted.
   */
  exiting: boolean
}
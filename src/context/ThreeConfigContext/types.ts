export interface ThreeConfigContextProviderProps {
  /**
   * Resets the camera to its default
   * orientation within the scene.
   */
  resetCamera: () => void
}

export interface ThreeConfigContextBag {
  /**
   * Indicates whether the 3D axes
   * show be rendered at the origin
   * point of the scene.
   */
  showAxes: boolean

  /**
   * Toggles the rendering of the 3D
   * axes on or off.
   *
   * @param showAxes The new value.
   */
  setShowAxes: (showAxes: boolean) => void

  /**
   * Indicates whether nodes show be
   * draggable with the cursor within
   * the scene.
   */
  draggableNodes: boolean

  /**
   * Toggles the ability to drag
   * nodes within the scene.
   *
   * @param draggableNodes The new value.
   */
  setDraggableNodes: (draggableNodes: boolean) => void

  /**
   * Resets the camera to its default
   * orientation within the scene.
   */
  resetCamera: () => void

  /**
   * Indicates that the camera
   * is currently being reset to its
   * original position.
   */
  resettingCamera: boolean

  /**
   * Sets a new value for resetting
   * the camera.
   *
   * @param resettingCamera The new boolean value.
   */
  setResettingCamera: (resettingCamera: boolean) => void
}
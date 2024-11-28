export interface ThreeConfigContextProviderProps {
  /**
   * Invoked when the camera has successfully
   * been reset to its default orientation and
   * position within the scene.
   */
  onResetCamera: () => void
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
   * Invoked when the camera has successfully
   * been reset to its default orientation and
   * position within the scene.
   */
  onResetCamera: () => void
}
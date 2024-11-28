import { useEffect, useRef } from 'react'
import { AxesHelper } from 'three'
import { ThreeAxisProps } from './types'
import { useThreeConfigContext } from 'context/ThreeConfigContext'

export const useThreeAxis = ({ graphRef }: ThreeAxisProps) => {
  const { showAxes } = useThreeConfigContext()
  const axesRef = useRef<AxesHelper | null>(null)
  
  useEffect(() => {
    if (graphRef.current) {
      const scene = graphRef.current.scene()

      if (showAxes) {
        const axesHelper = new AxesHelper(5000)
        axesRef.current = axesHelper
        scene.add(axesHelper)
      } else if (axesRef.current) {
        scene.remove(axesRef.current)
      }
    }
  }, [graphRef, showAxes])
}
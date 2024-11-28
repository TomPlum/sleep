import { useEffect } from 'react'
import Stats from 'stats.js'

export const useStats = () => {
  useEffect(() => {
    const stats = new Stats()
    stats.showPanel(0)
    stats.dom.style.top = ''
    stats.dom.style.right = '0'
    stats.dom.style.bottom = '0'
    stats.dom.style.left = ''
    document.body.appendChild(stats.dom)

    const animate = () => {
      stats.begin()
      stats.end()
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      document.body.removeChild(stats.dom)
    }
  }, [])
}
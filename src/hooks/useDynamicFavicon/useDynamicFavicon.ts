import { useEffect } from 'react'
import { useSleepContext } from 'context/SleepContext'

export const useDynamicFavicon = () => {
  const { sleepMetric } = useSleepContext()

  useEffect(() => {
    const existingFavicon = document.querySelector('link[rel=\'icon\']') as HTMLLinkElement
    const newFaviconUrl = `${import.meta.env.BASE_URL}favicon-${sleepMetric.split('_')[0]}.svg`

    if (existingFavicon) {
      existingFavicon.href = newFaviconUrl
    } else {
      const newFavicon = document.createElement('link')
      newFavicon.rel = 'icon'
      newFavicon.href = newFaviconUrl
      document.head.appendChild(newFavicon)
    }
  }, [sleepMetric])
}
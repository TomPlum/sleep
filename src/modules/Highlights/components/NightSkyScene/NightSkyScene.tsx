import styles from './NightSkyScene.module.scss'
import classNames from 'classnames'
import { CSSProperties, useMemo } from 'react'
import { useWindowSize } from '@uidotdev/usehooks'
import { NightSkySceneProps } from './types'

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const generateForegroundStars = () => {
  return Array(18).fill(0).map((_, i) => {
    // Between 0.1 and 1
    const animationDelay = Math.random() * 0.9 + 0.1

    // Between 10 and 50
    const top = Math.random() * (50 - 10) + 10

    // Between 15 and 80
    const left = Math.random() * (80 - 15) + 15

    return (
      <div
        key={i}
        className={styles.foregroundStar}
        style={{
          top: `${top}%`,
          left: `${left}%`,
          animationDelay: `${animationDelay}s`,
          WebkitAnimationDelay: `${animationDelay}s`,
        }}
      />
    )
  })
}

const generateBackgroundStars = () => {
  return Array(50).fill(0).map((_, i) => {
    // Between 5 and 55
    const top = Math.random() * (55 - 10) + 5

    // Between 5 and 95
    const left = Math.random() * (95 - 15) + 5

    return (
      <div
        key={i}
        className={styles.backgroundStar}
        style={{
          top: `${top}%`,
          left: `${left}%`
        }}
      />
    )
  })
}

export const NightSkyScene = ({ loaded, loading, exiting }: NightSkySceneProps) => {
  const { width } = useWindowSize()

  const path = useMemo(() => {
    const step = width === null || width < 1000 ? 4 : 2
    const quantity = width == null ? 75 : width > 1000 ? 100 : 50

    const values = Array(quantity).fill('').map((_v, i) => {
      const depth = getRandomInt(60, 150)
      return `${(i + 1) * step}% ${depth}px`
    })

    values.unshift('0% 0%') // <-- Top left [2]
    values.unshift('0% 100%') // <-- Bottom left [1]
    // Values from above are in the middle here
    values.push('100% 0%') // <-- Top Right [3]
    values.push('100% 100%') // <-- Bottom Right [4]

    return {
      '--path': values.join(',')
    }
  }, [width]) as CSSProperties

  const foregroundStars = useMemo(generateForegroundStars, [])
  const backgroundStars = useMemo(generateBackgroundStars, [])

  return (
    <div className={styles.scene}>
      <div className={styles.foregroundStars}>
        {foregroundStars}
      </div>

      <div className={styles.backgroundStars}>
        {backgroundStars}
      </div>

      {!loaded && (
        <div
          className={classNames(
            styles.moon,
            { [styles.loading]: loading },
            { [styles.moonExiting]: exiting }
          )}
        />
      )}

      <div className={styles.shootingStar1} />
      <div className={styles.shootingStar2} />

      {!loaded && (
        <div
          style={path}
          className={classNames(
            styles.mountains,
            { [styles.landExiting]: exiting }
          )}
        />
      )}

      {!loaded && (
        <div
          className={classNames(
            styles.land,
            { [styles.landExiting]: exiting }
          )}
        />
      )}

      {!loaded && (
        <div
          className={classNames(
            styles.windmill,
            { [styles.landExiting]: exiting }
          )}
        >
          <div className={styles.light} />
          <div className={styles.door} />
          <div className={styles.top} />
          <div className={styles.blades}>
            <div className={classNames(styles.blade, styles.blade1)} />
            <div className={classNames(styles.blade, styles.blade2)} />
            <div className={classNames(styles.blade, styles.blade3)} />
            <div className={classNames(styles.blade, styles.blade4)} />
          </div>
        </div>
      )}

      {!loaded && (
        <div
          className={classNames(
            styles.tree,
            { [styles.landExiting]: exiting }
          )}
        />
      )}
    </div>
  )
}
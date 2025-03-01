import styles from './LakesideSunrise.module.scss'
import classNames from 'classnames'

export const LakesideSunrise = () => {
  return (
    <div className={styles.landscape}>
      <div className={styles.mountain} />
      <div className={classNames(styles.mountain, styles.mountain2)} />
      <div className={classNames(styles.mountain, styles.mountain3)} />

      <div className={classNames(styles.sunContainer, styles.sunContainer1)} />

      <div className={styles.sunContainer}>
        <div className={styles.sun} />
      </div>
      <div className={styles.cloud} />
      <div className={classNames(styles.cloud, styles.cloud1)} />

      <div className={classNames(styles.sunContainer, styles.sunContainerReflection)}>
        <div className={styles.sun} />
      </div>

      <div className={styles.light} />
      <div className={classNames(styles.light, styles.light1)} />
      <div className={classNames(styles.light, styles.light2)} />
      <div className={classNames(styles.light, styles.light3)} />
      <div className={classNames(styles.light, styles.light4)} />
      <div className={classNames(styles.light, styles.light5)} />
      <div className={classNames(styles.light, styles.light6)} />
      <div className={classNames(styles.light, styles.light7)} />

      <div className={styles.water} />
      <div className={styles.splash} />

      <div className={classNames(styles.splash, styles.delay1)} />
      <div className={classNames(styles.splash, styles.delay2)} />

      <div className={classNames(styles.splash, styles.splash4, styles.delay2)} />
      <div className={classNames(styles.splash, styles.splash4, styles.delay3)} />
      <div className={classNames(styles.splash, styles.splash4, styles.delay4)} />

      <div className={classNames(styles.splash, styles.splashStone, styles.delay3)} />
      <div className={classNames(styles.splash, styles.splashStone, styles.splash4)} />
      <div className={classNames(styles.splash, styles.splashStone, styles.splash5)} />

      <div className={classNames(styles.lotus, styles.lotus1)} />
      <div className={classNames(styles.lotus, styles.lotus2)} />
      <div className={classNames(styles.lotus, styles.lotus3)} />

      <div className={styles.front}>
        <div className={styles.stone} />
        <div className={styles.grass} />
        <div className={classNames(styles.grass, styles.grass1)} />
        <div className={classNames(styles.grass, styles.grass2)} />
        <div className={styles.reed} />
        <div className={classNames(styles.reed, styles.reed1)} />
      </div>
    </div>
  )
}
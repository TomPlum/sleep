import classNames from 'classnames'
import styles from './LandingPageHeading.module.scss'
import { Link } from 'react-router-dom'
import { PageRoutes } from 'routes.ts'
import { AnimatedChevron } from 'modules/Highlights/components/AnimatedChevron'
import { Typography } from 'antd'
import { PillowDataFileLink } from 'components/PillowDataFileLink'
import { SleepingAnimation } from 'modules/Highlights/components/SleepingAnimation'
import { useTranslation } from 'react-i18next'
import { LandingPageHeadingProps } from './types'

export const LandingPageHeading = ({ className }: LandingPageHeadingProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'highlights.landing' })

  return (
    <div className={classNames(styles.header, className)}>
      <Link className={styles.chartsLink} to={PageRoutes.SLEEP}>
        <AnimatedChevron
          className={styles.chevron}
        />

        <Typography className={styles.chartsLinkText}>
          {t('go-to-charts')}
        </Typography>
      </Link>


      <Typography className={styles.heading}>
        {t('heading')}
      </Typography>

      <div className={styles.headerBottom}>
        <Typography className={styles.subheading}>
          {t('sub-heading')}

          <PillowDataFileLink
            className={styles.dataSourceLink}
          />
        </Typography>

        <SleepingAnimation
          className={styles.sleepingAnimation}
        />
      </div>
    </div>
  )
}
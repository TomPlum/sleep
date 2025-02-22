import styles from './ImprovementsPage.module.scss'
import { useTranslation } from 'react-i18next'
import { SleepMetricLineChart } from 'modules/MetricLineChart'
import { SleepMetric } from 'modules/ChartControls'
import { CalendarOutlined, ClockCircleOutlined, CoffeeOutlined, MehOutlined, RobotOutlined } from '@ant-design/icons'
import { ForwardRefExoticComponent, RefAttributes } from 'react'
import { AntdIconProps } from '@ant-design/icons/es/components/AntdIcon'

interface SectionProps {
  id: number
  translationKey: string
  Icon: ForwardRefExoticComponent<Omit<AntdIconProps, 'ref'> & RefAttributes<HTMLSpanElement>>
}

const Section = ({ id, translationKey, Icon }: SectionProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'improvements' })

  return (
    <div className={styles.section}>
      <Icon className={styles.icon} />

      <h4 className={styles.title}>
        {t(`${translationKey}.${id}.title`)}
      </h4>

      <p className={styles.content}>
        {t(`${translationKey}.${id}.desc`)}
      </p>
    </div>
  )
}

const issues = [
  {
    icon: ClockCircleOutlined
  },
  {
    icon: CoffeeOutlined
  },
  {
    icon: MehOutlined
  },
  {
    icon: RobotOutlined
  }
]

const solutions = [
  {
    icon: CalendarOutlined
  },
  {
    icon: CoffeeOutlined
  },
  {
    icon: MehOutlined
  },
  {
    icon: RobotOutlined
  }
]

export const ImprovementsPage = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'improvements' })

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1>{t('heading')}</h1>

        <div className={styles.chart}>
          {/*TODO: Extract some state and pass it in so we can hard code dates etc.*/}
          <SleepMetricLineChart metric={SleepMetric.QUALITY} />
        </div>

        <div className={styles.issues}>
          <h3 className={styles.heading}>
            {t('issues.heading')}
          </h3>

          {issues.map(({ icon }, i) => (
            <Section
              id={i + 1}
              Icon={icon}
              key={`issue-${i + 1}`}
              translationKey='issues'
            />
          ))}
        </div>

        <div className={styles.improvements}>
          <h3 className={styles.heading}>
            {t('solutions.heading')}
          </h3>

          {solutions.map(({ icon }, i) => (
            <Section
              id={i + 1}
              Icon={icon}
              key={`solutions-${i + 1}`}
              translationKey='solutions'
            />
          ))}
        </div>
      </div>
    </div>
  )
}
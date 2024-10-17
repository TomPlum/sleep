import styles from './SleepPage.module.scss'
import {MetricConfiguration} from "modules/controls/MetricConfiguration";
import {Spin, Switch} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {DateRangePicker} from "modules/controls/DateRangePicker";
import {SleepSessionsGraph2D} from "modules/graph/components/SleepSessionsGraph2D";
import {useSleepContext} from "context";
import {useTranslation} from "react-i18next";
import {useGraphStyles} from "modules/graph/hooks/useGraphStyles";
import {useCallback} from "react";

export const SleepPage = () => {
  const { currentMetricColour } = useGraphStyles()
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'sleep.graph2d' })
  const { activeSessions, sleepData, isSleepDataLoading } = useSleepContext()

  const handleChangeLanguage = useCallback(() => {
    const isEnglish = i18n.language === 'en'
    i18n.changeLanguage(isEnglish ? 'jp' : 'en')
  }, [i18n])

  if (isSleepDataLoading) {
    return (
      <Spin
        size="large"
        indicator={<LoadingOutlined spin />}
      />
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.topLeftControls}>
        <p style={{ color: currentMetricColour }} className={styles.sessions}>
          {t('sessions', {
            active: activeSessions,
            total: sleepData?.sessions.length
          })}
        </p>

        <Switch
          size='small'
          defaultChecked
          onChange={handleChangeLanguage}
          className={styles.languageSwitch}
          checkedChildren={t('language.checked')}
          unCheckedChildren={t('language.unchecked')}
        />
      </div>

      <div className={styles.controls}>
        <MetricConfiguration
          className={styles.configPanel}
        />

        <DateRangePicker />
      </div>

      <SleepSessionsGraph2D />
    </div>
  )
}
import styles from './SleepPageChrome.module.scss'
import { ActiveSessionInfo } from 'components/ActiveSessionInfo'
import { GraphControls } from 'modules/ChartControls'
import { PropsWithChildren } from 'react'

export const SleepPageChrome = ({ children }: PropsWithChildren) => {
  return (
    <div className={styles.container}>
      <ActiveSessionInfo className={styles.sessionInfo}/>

      <GraphControls className={styles.controls}/>

      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}
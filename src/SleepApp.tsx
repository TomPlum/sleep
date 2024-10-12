import {SleepSessionsGraph2D} from "modules/graph/SleepSessionsGraph2D";
import styles from './SleepApp.module.scss'

const SleepApp = () => (
    <div className={styles.container}>
      <SleepSessionsGraph2D/>
    </div>
);

export default SleepApp

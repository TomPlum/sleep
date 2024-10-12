import styles from './SleepApp.module.scss'
import {Outlet} from "react-router-dom";

const SleepApp = () => (
    <div className={styles.container}>
      <Outlet />
    </div>
);

export default SleepApp

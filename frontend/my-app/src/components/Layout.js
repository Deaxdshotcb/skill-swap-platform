import styles from './Layout.module.css';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <TopBar />
        <div className={styles.pageContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
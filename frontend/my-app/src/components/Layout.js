import styles from './Layout.module.css';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

// It now receives the onLogout function from App.js
const Layout = ({ children, onLogout }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainContent}>
        {/* And passes it down to the TopBar */}
        <TopBar onLogout={onLogout} />
        <div className={styles.pageContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
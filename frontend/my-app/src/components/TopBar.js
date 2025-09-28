import styles from './TopBar.module.css';

const TopBar = () => {
    // In a real app, get username from token/API
    const username = "Current User"; 
    
    return (
        <div className={styles.topbar}>
            <div className={styles.search}>
                {/* Search Icon Placeholder */}
                <span>🔍</span> 
                <input type="text" placeholder="Search" />
            </div>
            <div className={styles.userDetails}>
                {/* Notification Icon Placeholder */}
                <span>🔔</span>
                <span className={styles.username}>{username}</span>
                <div className={styles.userAvatar}></div>
            </div>
        </div>
    );
};

export default TopBar;
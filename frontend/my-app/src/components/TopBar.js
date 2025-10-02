import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // <-- Import useLocation
import Avatar from './Avatar';
import styles from './TopBar.module.css';

const TopBar = ({ onLogout }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const location = useLocation(); // <-- Get the current page's location

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setCurrentUser(decoded.admin || decoded.user);
            } catch (error) {
                console.error("Error decoding token in TopBar:", error);
            }
        }
    }, []);
    const searchVisiblePaths = ['/dashboard', '/matches'];
    
    return (
        <div className={styles.topbar}>
            {searchVisiblePaths.includes(location.pathname) && (
                <div className={styles.search}>
                    <span>🔍</span> 
                    <input type="text" placeholder="Search" />
                </div>
            )}

            {/* This empty div will take up the space when the search bar is hidden, keeping the user details on the right */}
            <div className={styles.spacer}></div>

            {currentUser && (
                <div className={styles.userDetails}>
                    
                    <span>🔔</span>
                    <Link to={`/profile/me`} className={styles.profileLink}>
                        <span className={styles.username}>{currentUser.username || 'Me'}</span>
                        <Avatar username={currentUser.username} />
                    </Link>
                    <button onClick={onLogout} className={styles.logoutButton}>Log out</button>
                </div>
            )}
        </div>
    );
};

export default TopBar;
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import styles from './TopBar.module.css';

const TopBar = ({ onLogout }) => {
    const [currentUser, setCurrentUser] = useState(null);

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
    
    return (
        <div className={styles.topbar}>
            {/* This spacer now pushes the user details to the far right */}
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
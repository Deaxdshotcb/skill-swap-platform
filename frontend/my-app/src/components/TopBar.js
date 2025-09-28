import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import styles from './TopBar.module.css';

const TopBar = ({ onLogout }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Store the whole user/admin object
                setCurrentUser(decoded.admin || decoded.user);
            } catch (error) {
                console.error("Error decoding token in TopBar:", error);
            }
        }
    }, []);
    
    return (
        <div className={styles.topbar}>
            <div className={styles.search}>
                <span>🔍</span> 
                <input type="text" placeholder="Search" />
            </div>
            {/* We only show user details if a user is logged in */}
            {currentUser && (
                <div className={styles.userDetails}>
                    <span>🔔</span>
                    {/* --- THIS IS NOW A LINK --- */}
                    <Link to={`/profile/${currentUser.id}`} className={styles.profileLink}>
                        <span className={styles.username}>{currentUser.username || 'Me'}</span>
                        <div className={styles.userAvatar}></div>
                    </Link>
                    <button onClick={onLogout} className={styles.logoutButton}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default TopBar;
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import styles from './TopBar.module.css';

// We now pass in the onLogout function as a prop
const TopBar = ({ onLogout }) => {
    const [username, setUsername] = useState("User");

    useEffect(() => {
        // Read the username from the token to display it
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if it's an admin or user token
                if (decoded.admin) {
                    setUsername(decoded.admin.username || 'Admin');
                } else if (decoded.user) {
                    setUsername(decoded.user.username || 'User');
                }
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
            <div className={styles.userDetails}>
                <span>🔔</span>
                <span className={styles.username}>{username}</span>
                <div className={styles.userAvatar}></div>
                {/* --- NEW LOGOUT BUTTON --- */}
                <button onClick={onLogout} className={styles.logoutButton}>Logout</button>
            </div>
        </div>
    );
};

export default TopBar;
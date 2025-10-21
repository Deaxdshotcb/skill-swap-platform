import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import api from '../api';
import Avatar from './Avatar';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const [matches, setMatches] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setCurrentUserId(decoded.user.id);
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }

        const fetchMatches = async () => {
            try {
                const res = await api.get('/matches');
                setMatches(res.data);
            } catch (err) {
                console.error("Failed to fetch matches for sidebar", err);
            }
        };

        fetchMatches();
    }, [location]); // Refetch matches when the page changes

    return (
        <div className={styles.sidebar}>
            <Link to="/dashboard" className={styles.logo}>
                Skill Swap
            </Link>
            
            <nav className={styles.nav}>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    Home
                </NavLink>
                <NavLink to="/matches" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    Matches
                </NavLink>
                <NavLink to="/profile/me" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    My Profile
                </NavLink>
            </nav>
            
            {/* --- QUICK CHAT SECTION --- */}
            <div className={styles.chatSection}>
                <h5>Quick Chat</h5>
                {matches.length > 0 ? (
                    <ul className={styles.chatList}>
                        {matches.map(match => {
                            const otherUser = match.user1_id === currentUserId
                                ? { id: match.user2_id, name: match.user2_username }
                                : { id: match.user1_id, name: match.user1_username };

                            return (
                                <li key={match.match_id}>
                                    <Link
                                        to={`/chat/${match.match_id}`}
                                        state={{ otherUserName: otherUser.name }}
                                        className={styles.chatLink}
                                    >
                                        <Avatar username={otherUser.name} size={28} />
                                        <span>{otherUser.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className={styles.noChats}>No matches yet.</p>
                )}
            </div>
            
            <div className={styles.footer}>
                <p>&copy; 2025 Skill Swap</p>
            </div>
        </div>
    );
};

export default Sidebar;
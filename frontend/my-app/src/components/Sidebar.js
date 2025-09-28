import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

// Dummy data for chats
const chats = [
    { id: 1, name: 'User 1', skill: 'Guitar' },
    { id: 2, name: 'User 2', skill: 'Cooking' },
];

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <div className={styles.title}>
                <h2>Skill Swap</h2>
            </div>
            <nav className={styles.nav}>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
                    Dashboard
                </NavLink>
                 <NavLink to="/matches" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
                    Matches
                </NavLink>
            </nav>
            <div className={styles.chats}>
                {chats.map(chat => (
                    <NavLink to={`/chat/${chat.id}`} key={chat.id} className={({ isActive }) => isActive ? styles.activeChat : styles.chatItem}>
                        <div className={styles.avatar}></div>
                        <div className={styles.chatInfo}>
                            <span className={styles.chatName}>{chat.name}</span>
                            <span className={styles.chatSkill}>{chat.skill}</span>
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
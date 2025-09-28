import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import api from '../api';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const [opportunities, setOpportunities] = useState([]);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                // 1. Fetch ALL opportunities from the backend
                const res = await api.get('/dashboard/opportunities');
                const allOpps = res.data;

                // 2. Get the list of 'seen' IDs from the browser's memory
                const seenOpps = JSON.parse(localStorage.getItem('seenOpportunities')) || [];

                // 3. Filter out the opportunities that have already been seen
                const newOpps = allOpps.filter(opp => !seenOpps.includes(opp.requester_id));

                // 4. Set the state with only the new, unseen opportunities
                setOpportunities(newOpps);
            } catch (err) {
                console.error("Failed to fetch opportunities for sidebar", err);
            }
        };
        fetchOpportunities();
    }, []);

    // This function runs when you click a notification
    const handleNotificationClick = (opportunityId) => {
        // Get the current list of seen IDs
        const seenOpps = JSON.parse(localStorage.getItem('seenOpportunities')) || [];
        
        // Add the new ID to the list
        const updatedSeenOpps = [...seenOpps, opportunityId];

        // Save the updated list back to the browser's memory
        localStorage.setItem('seenOpportunities', JSON.stringify(updatedSeenOpps));

        // Update the UI to remove the clicked notification
        setOpportunities(prevOpps => prevOpps.filter(opp => opp.requester_id !== opportunityId));
    };

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
            
            <div className={styles.opportunities}>
                <h5>Requests For You</h5>
                {opportunities.length > 0 ? (
                    <div className={styles.opportunityList}>
                        {opportunities.map(opp => (
                            <Link 
                                to={`/profile/${opp.requester_id}`} 
                                key={opp.requester_id} 
                                className={styles.opportunityItem}
                                // This onClick handler makes the notification disappear
                                onClick={() => handleNotificationClick(opp.requester_id)}
                            >
                                <strong>{opp.requester_name}</strong> wants to learn <strong>{opp.skill_name}</strong>.
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className={styles.noOpportunities}>No new requests found.</p>
                )}
            </div>
            
            <div className={styles.footer}>
                <p>&copy; 2025 Skill Swap</p>
            </div>
        </div>
    );
};

export default Sidebar;
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ProfileMatchCard from '../components/ProfileMatchCard';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setCurrentUserId(decoded.user.id);
        }
        
        const fetchMatches = async () => {
            try {
                const res = await api.get('/matches');
                setMatches(res.data);
            } catch (err) {
                console.error("Failed to fetch matches", err);
            }
        };
        fetchMatches();
    }, []);

    return (
        <div className={styles.dashboard}>
            <div className={styles.actions}>
                <button className={`${styles.actionButton} ${styles.addSkill}`} onClick={() => navigate('/create')}>+ Add Skills</button>
                <button className={`${styles.actionButton} ${styles.addBio}`} onClick={() => navigate(`/profile/${currentUserId}`)}>+ My Profile</button>
                <button className={`${styles.actionButton} ${styles.offerSkill}`} onClick={() => navigate('/create')}>+ Offer Skills</button>
                <button className={`${styles.actionButton} ${styles.requestSkill}`} onClick={() => navigate('/create')}>+ Request Skills</button>
            </div>

            <div className={styles.matchesContainer}>
                <h2>Your Confirmed Matches</h2>
                <div className={styles.matchesGrid}>
                    {matches.map(match => {
                        // Determine who the "other user" is
                        const otherUser = match.user1_id === currentUserId 
                            ? { name: match.user2_username, skill: match.user2_skill }
                            : { name: match.user1_username, skill: match.user1_skill };
                        
                        return (
                            <ProfileMatchCard 
                                key={match.match_id}
                                name={otherUser.name}
                                skills={`Teaches: ${otherUser.skill}`}
                                matchPercent={90} // This is just for display
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;